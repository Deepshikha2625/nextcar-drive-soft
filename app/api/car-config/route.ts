import { NextResponse } from "next/server";

const carConfig = {
  basePrice: 8500000,
  options: {
    customize: {
      "Sport Package": 420000,
      "Track Edition": 680000,
      "Luxury Trim": 550000,
    },
    paintjob: {
      "Onyx Black": 85000,
      "Racing Red": 95000,
      "Glacier White": 80000,
      "Midnight Blue": 90000,
    },
    bodywork: {
      "Carbon Fiber Hood": 120000,
      "Wide Body Kit": 250000,
      "Rear Diffuser": 75000,
    },
    accessories: {
      "Forged Alloy Wheels": 180000,
      "Sport Exhaust": 90000,
      "Carbon Wing": 140000,
    },
  },
};

export async function GET() {
  return NextResponse.json({ success: true, data: carConfig });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { selections } = body as {
    selections: { category: string; option: string }[];
  };

  let total = carConfig.basePrice;
  const breakdown: { item: string; price: number }[] = [];

  for (const sel of selections) {
    const categoryOptions =
      carConfig.options[sel.category as keyof typeof carConfig.options];
    if (categoryOptions) {
      const price = categoryOptions[sel.option as keyof typeof categoryOptions];
      if (price) {
        total += price;
        breakdown.push({ item: `${sel.category}: ${sel.option}`, price });
      }
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      basePrice: carConfig.basePrice,
      addons: breakdown,
      totalPrice: total,
      formattedTotal: `₹${(total / 100000).toFixed(1)} Lakh`,
    },
  });
}
