import { NextResponse } from "next/server";

const telemetryData = {
  "01": {
    lap: "LAP 01",
    zone: "Speed Zone",
    topSpeed: 198,
    avgSpeed: 162,
    acceleration: "0-100: 3.8s",
    gForce: 1.4,
    tireTemp: { fl: 82, fr: 80, rl: 85, rr: 83 },
    lapTime: "1:42.340",
  },
  "02": {
    lap: "LAP 02",
    zone: "Acceleration Zone",
    topSpeed: 215,
    avgSpeed: 178,
    acceleration: "0-100: 3.5s",
    gForce: 1.8,
    tireTemp: { fl: 88, fr: 87, rl: 91, rr: 90 },
    lapTime: "1:39.120",
  },
  "03": {
    lap: "LAP 03",
    zone: "Technical Section",
    topSpeed: 195,
    avgSpeed: 155,
    acceleration: "0-100: 3.6s",
    gForce: 2.4,
    tireTemp: { fl: 96, fr: 94, rl: 98, rr: 97 },
    lapTime: "1:38.560",
  },
  "04": {
    lap: "LAP 04",
    zone: "High Speed Zone",
    topSpeed: 228,
    avgSpeed: 195,
    acceleration: "0-100: 3.4s",
    gForce: 2.0,
    tireTemp: { fl: 102, fr: 99, rl: 105, rr: 103 },
    lapTime: "1:36.890",
  },
  "05": {
    lap: "LAP 05",
    zone: "Final Corner",
    topSpeed: 210,
    avgSpeed: 172,
    acceleration: "0-100: 3.5s",
    gForce: 2.2,
    tireTemp: { fl: 108, fr: 106, rl: 110, rr: 109 },
    lapTime: "1:37.450",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lapId = searchParams.get("lap");

  if (lapId && telemetryData[lapId as keyof typeof telemetryData]) {
    return NextResponse.json({
      success: true,
      data: telemetryData[lapId as keyof typeof telemetryData],
    });
  }

  return NextResponse.json({
    success: true,
    data: Object.values(telemetryData),
  });
}
