import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      serviceId,
      serviceName,
      price,
      date,
      timeSlot,
      name,
      email,
      phone,
      notes,
      userId,
    } = body;

    // Validate inputs
    if (!serviceId || !serviceName || !date || !timeSlot || !name || !email) {
      return NextResponse.json(
        { error: "Missing required booking details." },
        { status: 400 },
      );
    }

    // Check if the slot is already booked in NeonDB
    const bookingDate = new Date(date);
    const startOfDay = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate(),
    );
    const endOfDay = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate() + 1,
    );

    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
        timeSlot,
        status: "paid",
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          error:
            "This date and time slot is already booked. Please choose another slot.",
        },
        { status: 409 },
      );
    }

    // Server-side cost calculation
    let subtotal = 0;
    if (serviceId === "rehearsal") {
      subtotal = 70.0;
    } else if (serviceId === "recording") {
      subtotal = 100.0;
    } else if (serviceId === "mastering") {
      subtotal = 60.0;
    } else {
      subtotal = 150.0;
    }

    // Calculate Stripe fee (2.9% + 30c)
    const stripeFee = parseFloat((subtotal * 0.029 + 0.3).toFixed(2));
    const total = parseFloat((subtotal + stripeFee).toFixed(2));
    const amountInCents = Math.round(total * 100);

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Mohikontok: ${serviceName}`,
              description: `Booking Slot: ${timeSlot} on ${date}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}?status=success&session_id={CHECKOUT_SESSION_ID}&service_id=${serviceId}&service_name=${encodeURIComponent(serviceName)}&date=${encodeURIComponent(date)}&time_slot=${encodeURIComponent(timeSlot)}&client_name=${encodeURIComponent(name)}&client_email=${encodeURIComponent(email)}&client_phone=${encodeURIComponent(phone || "")}&notes=${encodeURIComponent(notes || "")}`,
      cancel_url: `${baseUrl}/#scheduler`,
      customer_email: email,
      custom_text: {
        submit: {
          message:
            "By paying, you agree to the Mohikontok Studio rules:\n• Respect the Space: Treat equipment & acoustic treatments with care. Report damage immediately.\n• Session Time: Arrive 10–15 mins early. Sessions start & end on time.\n• Clean Studio: No smoking, vaping, or illegal substances. Keep food/drinks away from recording gear.\n• Guest Policy: Only registered guests. Visitors must stay with the client. Large groups need approval.\n• Noise & Etiquette: Keep hallways quiet. Silence phones during recording. Respect artist privacy. No unauthorized photo/video/streaming.\n• Equipment: Use gear properly. No personal gear without approval. Client is liable for misuse/damage.\n• Safety: Emergency exits clear. Children under 16 must be supervised.\n• Payments & Cancellations: Payments due before/at start. 24h cancellation notice required; no-shows forfeit deposits.",
        },
      },
      metadata: {
        serviceId,
        serviceName,
        price: total.toString(),
        date,
        timeSlot,
        clientName: name,
        clientEmail: email,
        clientPhone: phone || "",
        notes: notes || "",
        userId: userId || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Session Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
