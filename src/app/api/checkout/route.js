import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, items, total, shippingAddress, paymentMethod } = body;

    if (!id || !items?.length || !total || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    if (!shippingAddress.name || !shippingAddress.email || !shippingAddress.phone) {
      return NextResponse.json(
        { error: "Shipping details are incomplete" },
        { status: 400 }
      );
    }

    if (paymentMethod === "razorpay") {
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          key_secret: process.env.RAZORPAY_KEY_SECRET || "",
        });

        const order = await razorpay.orders.create({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: id,
          notes: {
            orderId: id,
            customerName: shippingAddress.name,
            customerEmail: shippingAddress.email,
          },
        });

        return NextResponse.json({
          success: true,
          razorpayOrderId: order.id,
          amount: order.amount,
        });
      } catch (razorpayError) {
        console.error("Razorpay order creation failed:", razorpayError);
        return NextResponse.json(
          { error: "Payment gateway error. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      orderId: id,
      message: "Order placed successfully (COD)",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
