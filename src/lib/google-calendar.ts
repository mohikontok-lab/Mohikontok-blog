import { prisma } from "./prisma";

interface ParsedTimes {
  start: Date;
  end: Date;
}

function parseDateTime(date: Date, timeStr: string): ParsedTimes {
  // timeStr is like "02:00 PM - 04:00 PM"
  const parts = timeStr.split(" - ");
  
  const parsePart = (part: string): { hours: number; minutes: number } => {
    // part is like "02:00 PM" or "10:00 AM"
    const cleanPart = part.trim();
    const spaceIndex = cleanPart.indexOf(" ");
    if (spaceIndex === -1) {
      return { hours: 12, minutes: 0 };
    }
    const time = cleanPart.substring(0, spaceIndex);
    const ampm = cleanPart.substring(spaceIndex + 1);
    
    const timeParts = time.split(":");
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1] || "0", 10);
    
    if (ampm === "PM" && hours !== 12) {
      hours += 12;
    }
    if (ampm === "AM" && hours === 12) {
      hours = 0;
    }
    return { hours, minutes };
  };

  const startParsed = parsePart(parts[0]);
  const endParsed = parsePart(parts[1] || parts[0]);

  const start = new Date(date);
  start.setHours(startParsed.hours, startParsed.minutes, 0, 0);

  const end = new Date(date);
  end.setHours(endParsed.hours, endParsed.minutes, 0, 0);

  return { start, end };
}

async function refreshGoogleAccessToken(accountId: string, refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Failed to refresh Google token:", data);
      return null;
    }

    const newAccessToken = data.access_token;
    const expiresAt = data.expires_in ? Math.floor(Date.now() / 1000) + data.expires_in : null;

    // Update database
    await prisma.account.update({
      where: { id: accountId },
      data: {
        access_token: newAccessToken,
        expires_at: expiresAt,
      },
    });

    return newAccessToken;
  } catch (err) {
    console.error("Error refreshing Google access token:", err);
    return null;
  }
}

export async function syncBookingToGoogleCalendar(bookingId: string) {
  try {
    console.log(`Starting Google Calendar sync for booking ID: ${bookingId}`);
    
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      console.error(`Booking not found: ${bookingId}`);
      return;
    }

    const ownerEmail = process.env.STUDIO_OWNER_EMAIL || "mohikontok@gmail.com";
    
    // 1. Try to find the studio owner's Google account first
    const owner = await prisma.user.findFirst({
      where: { email: ownerEmail },
      include: { accounts: { where: { provider: "google" } } },
    });

    let activeAccount = owner?.accounts[0];
    let isOwnerSync = !!activeAccount;

    // 2. Fall back to the client's Google account if owner isn't authenticated yet
    if (!activeAccount && booking.userId) {
      const client = await prisma.user.findUnique({
        where: { id: booking.userId },
        include: { accounts: { where: { provider: "google" } } },
      });
      activeAccount = client?.accounts[0];
      isOwnerSync = false;
    }

    if (!activeAccount || !activeAccount.refresh_token) {
      console.warn(
        `Calendar sync skipped for booking ${bookingId}: No Google account with refresh token available for owner (${ownerEmail}) or client (userId: ${booking.userId || "guest"}).`
      );
      return;
    }

    // 3. Refresh and obtain a fresh access token
    const accessToken = await refreshGoogleAccessToken(activeAccount.id, activeAccount.refresh_token);
    if (!accessToken) {
      console.error(`Failed to obtain Google access token for sync.`);
      return;
    }

    // 4. Parse dates
    const { start, end } = parseDateTime(booking.date, booking.timeSlot);

    // 5. Construct event payload
    const eventPayload = {
      summary: `Mohikontok Sound Lab: ${booking.serviceName}`,
      location: "1389 Kearney Ave, Bronx, NY 10465",
      description: `Service: ${booking.serviceName}\nClient Name: ${booking.clientName}\nEmail: ${booking.clientEmail}\nPhone: ${booking.clientPhone || "N/A"}\nNotes: ${booking.notes || "None"}\nReceipt Reference: ${booking.transactionId || "N/A"}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "America/New_York",
      },
      attendees: [
        { email: booking.clientEmail },
        { email: ownerEmail },
      ],
    };

    // 6. Insert event into primary calendar
    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&key=${process.env.GOOGLE_API_KEY || ""}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      }
    );

    const result = await calendarResponse.json();
    if (!calendarResponse.ok) {
      console.error("Google Calendar API insertion failed:", result);
      return;
    }

    console.log(
      `Google Calendar event successfully created via ${isOwnerSync ? "Owner" : "Client"} Google Account. Event ID: ${result.id}`
    );
  } catch (err) {
    console.error("Error in syncBookingToGoogleCalendar:", err);
  }
}
