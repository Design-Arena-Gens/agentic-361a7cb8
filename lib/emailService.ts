import nodemailer from 'nodemailer'
import { PriceRecord } from './storage'

const RECIPIENT_EMAIL = 'sweyjotdhillon@gmail.com'

export async function sendPriceEmail(
  currentPrice: PriceRecord,
  previousPrice: PriceRecord | null,
  history: PriceRecord[]
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const emailHtml = generateEmailHTML(currentPrice, previousPrice, history)

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: RECIPIENT_EMAIL,
    subject: `LTC Price Report - ₹${currentPrice.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (${new Date().toLocaleDateString('en-IN')})`,
    html: emailHtml,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully to', RECIPIENT_EMAIL)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

function generateEmailHTML(
  current: PriceRecord,
  previous: PriceRecord | null,
  history: PriceRecord[]
): string {
  const changeVsPrevious = previous
    ? ((current.totalValue - previous.totalValue) / previous.totalValue) * 100
    : 0

  const changeAmountVsPrevious = previous
    ? current.totalValue - previous.totalValue
    : 0

  const last7Days = history.slice(0, 7)
  const avgLast7Days =
    last7Days.length > 0
      ? last7Days.reduce((sum, record) => sum + record.totalValue, 0) /
        last7Days.length
      : current.totalValue

  const changeVsAvg =
    avgLast7Days > 0
      ? ((current.totalValue - avgLast7Days) / avgLast7Days) * 100
      : 0

  const highest = history.reduce(
    (max, record) => (record.totalValue > max ? record.totalValue : max),
    current.totalValue
  )
  const lowest = history.reduce(
    (min, record) => (record.totalValue < min ? record.totalValue : min),
    current.totalValue
  )

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #667eea;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #667eea;
      margin: 0;
      font-size: 28px;
    }
    .header .date {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
    .main-stats {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 25px;
      text-align: center;
    }
    .main-stats .total {
      font-size: 36px;
      font-weight: bold;
      margin: 10px 0;
    }
    .main-stats .subtitle {
      font-size: 14px;
      opacity: 0.9;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 25px;
    }
    .stat-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .stat-box .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .stat-box .value {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .positive {
      color: #10b981 !important;
    }
    .negative {
      color: #ef4444 !important;
    }
    .change-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .change-section h2 {
      font-size: 18px;
      margin-top: 0;
      color: #667eea;
    }
    .change-item {
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .change-item:last-child {
      border-bottom: none;
    }
    .change-item .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    .change-item .value {
      font-size: 16px;
      font-weight: 600;
    }
    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .history-table th {
      background: #667eea;
      color: white;
      padding: 10px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
    }
    .history-table td {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .history-table tr:last-child td {
      border-bottom: none;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 LTC Price Report</h1>
      <div class="date">${new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'short',
      })}</div>
    </div>

    <div class="main-stats">
      <div class="subtitle">Total Value of 2000 LTC</div>
      <div class="total">₹${current.totalValue.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      })}</div>
      <div class="subtitle">
        LTC Price: ₹${current.priceInr.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
        })} | $${current.priceUsd.toFixed(2)}
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-box">
        <div class="label">24h Change</div>
        <div class="value ${current.change24h && current.change24h > 0 ? 'positive' : 'negative'}">
          ${current.change24h && current.change24h > 0 ? '+' : ''}${
    current.change24h ? current.change24h.toFixed(2) : '0.00'
  }%
        </div>
      </div>
      <div class="stat-box">
        <div class="label">Change vs Previous</div>
        <div class="value ${changeVsPrevious > 0 ? 'positive' : 'negative'}">
          ${changeVsPrevious > 0 ? '+' : ''}${changeVsPrevious.toFixed(2)}%
        </div>
      </div>
      <div class="stat-box">
        <div class="label">Highest (All Time)</div>
        <div class="value">₹${highest.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
        })}</div>
      </div>
      <div class="stat-box">
        <div class="label">Lowest (All Time)</div>
        <div class="value">₹${lowest.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
        })}</div>
      </div>
    </div>

    <div class="change-section">
      <h2>📈 Detailed Analysis</h2>

      ${
        previous
          ? `
      <div class="change-item">
        <div class="label">Change from Previous Day</div>
        <div class="value ${changeAmountVsPrevious > 0 ? 'positive' : 'negative'}">
          ${changeAmountVsPrevious > 0 ? '+' : ''}₹${Math.abs(
              changeAmountVsPrevious
            ).toLocaleString('en-IN', {
              maximumFractionDigits: 2,
            })}
          (${changeVsPrevious > 0 ? '+' : ''}${changeVsPrevious.toFixed(2)}%)
        </div>
      </div>
      `
          : '<div class="change-item"><div class="label">No previous data available yet</div></div>'
      }

      ${
        last7Days.length >= 2
          ? `
      <div class="change-item">
        <div class="label">7-Day Average</div>
        <div class="value">₹${avgLast7Days.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
        })}</div>
      </div>
      <div class="change-item">
        <div class="label">Change vs 7-Day Average</div>
        <div class="value ${changeVsAvg > 0 ? 'positive' : 'negative'}">
          ${changeVsAvg > 0 ? '+' : ''}${changeVsAvg.toFixed(2)}%
        </div>
      </div>
      `
          : ''
      }
    </div>

    ${
      history.length > 0
        ? `
    <div class="change-section">
      <h2>📅 Recent History</h2>
      <table class="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Price (INR)</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          ${history
            .slice(0, 7)
            .map(
              (record) => `
            <tr>
              <td>${new Date(record.timestamp).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}</td>
              <td>₹${record.priceInr.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
              })}</td>
              <td>₹${record.totalValue.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
              })}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
    `
        : ''
    }

    <div class="footer">
      <p>This is an automated report generated by LTC Price Tracker</p>
      <p>Tracking 2000 LTC | Daily reports at 4:00 PM IST</p>
    </div>
  </div>
</body>
</html>
  `
}
