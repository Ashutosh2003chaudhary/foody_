// app/api/verify-payment/route.ts
import { razorpay } from '@/utils/razorpay';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Update your database here
      return NextResponse.json({ 
        message: "Payment verified successfully" 
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        error: "Invalid signature" 
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: "Error verifying payment" 
    }, { status: 500 });
  }
}
