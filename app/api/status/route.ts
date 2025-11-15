import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: '✅ LTC Price Tracker is active. Daily emails will be sent at 4:00 PM IST to sweyjotdhillon@gmail.com.',
    status: 'active',
    scheduledTime: '16:00 IST',
    recipient: 'sweyjotdhillon@gmail.com',
    ltcAmount: 2000,
  })
}
