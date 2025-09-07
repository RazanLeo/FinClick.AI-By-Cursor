import { NextRequest, NextResponse } from 'next/server';
import { handlePaymentCallback } from '@/lib/payments/subscription';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const transactionRef = body?.cart_id || body?.tran_ref || '';
    const status = body?.resp_status || body?.payment_result?.response_status || 'U';
    const result = await handlePaymentCallback(transactionRef, status, body);
    return NextResponse.json({ success: result.success });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}


