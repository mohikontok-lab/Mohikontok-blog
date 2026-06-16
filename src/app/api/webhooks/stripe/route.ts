import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { syncBookingToGoogleCalendar } from "@/lib/google-calendar";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata) {
      try {
        const {
          serviceName,
          price,
          date,
          timeSlot,
          clientName,
          clientEmail,
          clientPhone,
          notes,
          userId,
        } = metadata;

        console.log(`Saving booking details to NeonDB for ${clientEmail}...`);

        // Create booking in database
        const booking = await prisma.booking.create({
          data: {
            userId: userId ? userId : null,
            serviceName,
            price: price.startsWith("$") ? price : `$${price}`,
            date: new Date(date),
            timeSlot,
            clientName,
            clientEmail,
            clientPhone: clientPhone || null,
            notes: notes || null,
            status: "paid",
            transactionId: session.id,
          },
        });

        console.log(`Booking successfully saved to database: ${booking.id}`);

        // Trigger Google Calendar sync asynchronously
        syncBookingToGoogleCalendar(booking.id).catch((err) => {
          console.error("Calendar sync failed:", err);
        });
      } catch (dbErr) {
        console.error("Failed to save booking to NeonDB:", dbErr);
        return NextResponse.json(
          { error: "Database save operation failed" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
