import dotenv from "dotenv";
dotenv.config();
type ScheduleGoogleCalendarInput = {
  googleCalendarAccessToken: string;
  date: string;
  startTime: string;
  endTime: string;
};

type GoogleCalendarEventResponse = {
  id: string;
  htmlLink: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
};

function parseMmDdYyyyDateTime(date: string, time: string): Date {
  const dateMatch = /^(\d{2})-(\d{2})-(\d{4})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);

  if (!dateMatch || !timeMatch) {
    throw new Error("Invalid date or time. Use date MM-DD-YYYY and time HH:mm.");
  }

  const [, month, day, year] = dateMatch;
  const [, hours, minutes] = timeMatch;
  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes)
  );

  if (
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day) ||
    parsedDate.getHours() !== Number(hours) ||
    parsedDate.getMinutes() !== Number(minutes)
  ) {
    throw new Error("Invalid date or time. Use date MM-DD-YYYY and time HH:mm.");
  }

  return parsedDate;
}

export async function scheduleTimeInGoogleCalendar({
  googleCalendarAccessToken,
  date,
  startTime,
  endTime,
}: ScheduleGoogleCalendarInput): Promise<GoogleCalendarEventResponse> {
  if (!googleCalendarAccessToken) {
    throw new Error("Google Calendar OAuth access token is required.");
  }

  const timeZone = "America/New_York";
  const startDate = parseMmDdYyyyDateTime(date, startTime);
  const endDate = parseMmDdYyyyDateTime(date, endTime);

  if (endDate <= startDate) {
    throw new Error("End time must be after start time.");
  }

  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${googleCalendarAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: "Scheduled event",
      start: {
        dateTime: startDate.toISOString(),
        timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Failed to schedule Google Calendar event.");
  }

  return data;
}

const googleCalendarAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
console.log("googleCalendarAccessToken : ", googleCalendarAccessToken);

if (!googleCalendarAccessToken) {
  throw new Error("Set GOOGLE_ACCESS_TOKEN to a real OAuth 2 access token, not a Google API key.");
}

scheduleTimeInGoogleCalendar({
  googleCalendarAccessToken,
  date: "06-20-2026",
  startTime: "12:00",
  endTime: "13:00",
})
