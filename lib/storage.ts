export interface PriceRecord {
  timestamp: string
  priceUsd: number
  priceInr: number
  totalValue: number
  change24h?: number
  changePercent?: number
}

let priceHistory: PriceRecord[] = []

export function addPriceRecord(record: PriceRecord) {
  priceHistory.unshift(record)
  if (priceHistory.length > 100) {
    priceHistory = priceHistory.slice(0, 100)
  }
}

export function getPriceHistory(): PriceRecord[] {
  return priceHistory
}

export function getLatestPrice(): PriceRecord | null {
  return priceHistory[0] || null
}

export function getPreviousPrice(): PriceRecord | null {
  return priceHistory[1] || null
}
