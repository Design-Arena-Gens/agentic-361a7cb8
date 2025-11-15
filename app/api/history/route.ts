import { NextResponse } from 'next/server'
import { getPriceHistory } from '@/lib/storage'

export async function GET() {
  const history = getPriceHistory()
  return NextResponse.json({ history })
}
