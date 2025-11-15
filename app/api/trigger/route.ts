import { NextResponse } from 'next/server'
import { getLTCPrice } from '@/lib/priceService'
import { addPriceRecord, getPriceHistory, getPreviousPrice } from '@/lib/storage'
import { sendPriceEmail } from '@/lib/emailService'

export async function POST() {
  try {
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
        message: 'Price recorded and email sent successfully',
        price: priceRecord,
      })
    } else {
      return NextResponse.json({
        message: 'Price recorded but email not sent (credentials not configured)',
        price: priceRecord,
        warning: 'Configure EMAIL_USER and EMAIL_PASSWORD environment variables to enable email sending',
      })
    }
  } catch (error: any) {
    console.error('Error in trigger endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to process price update', details: error.message },
      { status: 500 }
    )
  }
}
