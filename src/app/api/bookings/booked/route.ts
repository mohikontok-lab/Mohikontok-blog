import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    if (!dateStr) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    const date = new Date(dateStr);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    // Find all bookings on that date with status "paid"
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: "paid",
      },
      select: {
        timeSlot: true,
      },
    });

    const bookedSlots = bookings.map(b => b.timeSlot);
    return NextResponse.json({ bookedSlots });
  } catch (err: any) {
    console.error("Error fetching booked slots:", err);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
