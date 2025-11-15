import { NextResponse } from 'next/server'
import { getLTCPrice } from '@/lib/priceService'
import { addPriceRecord, getPriceHistory, getPreviousPrice } from '@/lib/storage'
import { sendPriceEmail } from '@/lib/emailService'

export const dynamic = 'force-dynamic'

// This endpoint will be called by Vercel Cron
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron (optional for development)
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch current LTC price
    const priceData = await getLTCPrice()

    // Create price record
    const priceRecord = {
      timestamp: new Date().toISOString(),
      priceUsd: priceData.priceUsd,
      priceInr: priceData.priceInr,
      totalValue: priceData.totalValue,
      change24h: priceData.change24h,
      changePercent: priceData.changePercent,
    }

    // Get previous price before adding new one
    const previousPrice = getPreviousPrice()

    // Add to history
    addPriceRecord(priceRecord)

    // Get full history
    const history = getPriceHistory()

    // Send email if credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await sendPriceEmail(priceRecord, previousPrice, history)
      return NextResponse.json({
        success: true,
        message: 'Price recorded and email sent successfully',
        timestamp: priceRecord.timestamp,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email credentials not configured',
      })
    }
  } catch (error: any) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { error: 'Failed to process cron job', details: error.message },
      { status: 500 }
    )
  }
}
