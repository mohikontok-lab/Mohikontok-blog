import { NextResponse } from "next/server";
import Stripe from "stripe";

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
        { status: 400 }
      );
    }

    // Server-side cost calculation
    let subtotal = 0;
    if (serviceId === "rehearsal") {
      subtotal = 70.00;
    } else if (serviceId === "recording") {
      subtotal = 100.00;
    } else if (serviceId === "mastering") {
      subtotal = 60.00;
    } else {
      subtotal = 150.00;
    }

    // Calculate Stripe fee (2.9% + 30c)
    const stripeFee = parseFloat((subtotal * 0.029 + 0.30).toFixed(2));
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
      { status: 500 }
    );
  }
}
