import axios from 'axios'

const LTC_AMOUNT = 2000
const USD_TO_INR = 83.5 // Approximate exchange rate

export interface PriceData {
  priceUsd: number
  priceInr: number
  totalValue: number
  change24h: number
  changePercent: number
}

export async function getLTCPrice(): Promise<PriceData> {
  try {
    // Using CoinGecko API (free, no API key required)
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd,inr&include_24hr_change=true'
    )

    const ltcData = response.data.litecoin
    const priceUsd = ltcData.usd
    const priceInr = ltcData.inr
    const change24h = ltcData.usd_24h_change || 0

    const totalValue = priceInr * LTC_AMOUNT

    return {
      priceUsd,
      priceInr,
      totalValue,
      change24h,
      changePercent: change24h,
    }
  } catch (error) {
    console.error('Error fetching LTC price:', error)

    // Fallback: try backup API
    try {
      const backupResponse = await axios.get(
        'https://api.coinbase.com/v2/prices/LTC-USD/spot'
      )
      const priceUsd = parseFloat(backupResponse.data.data.amount)
      const priceInr = priceUsd * USD_TO_INR
      const totalValue = priceInr * LTC_AMOUNT

      return {
        priceUsd,
        priceInr,
        totalValue,
        change24h: 0,
        changePercent: 0,
      }
    } catch (backupError) {
      throw new Error('Failed to fetch LTC price from all sources')
    }
  }
}
