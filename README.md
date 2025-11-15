# LTC Price Tracker

Daily Litecoin price monitoring system that tracks 2000 LTC and sends detailed email reports at 4 PM IST.

## Features

- ⏰ Automated daily price checks at 4:00 PM IST
- 📧 Detailed email reports to sweyjotdhillon@gmail.com
- 📊 Price tracking in both USD and INR (₹)
- 📈 Historical price analysis with 7-day averages
- 🎨 Beautiful web dashboard to view status and history
- 🔄 Manual trigger option for immediate reports

## Setup

### 1. Environment Variables

Create a `.env.local` file with your Gmail credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

**To get a Gmail App Password:**
1. Go to Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords (https://myaccount.google.com/apppasswords)
4. Create a new app password for "Mail"
5. Use that generated password in EMAIL_PASSWORD

### 2. Vercel Deployment

The app is configured to run a cron job daily at 4 PM IST (10:30 AM UTC):

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-361a7cb8
```

After deployment, add these environment variables in Vercel:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: Your Gmail app-specific password

## How It Works

1. **Scheduled Job**: Vercel Cron runs daily at 4:00 PM IST
2. **Price Fetch**: Retrieves current LTC price from CoinGecko API
3. **Calculation**: Multiplies price by 2000 LTC
4. **Analysis**: Compares with previous days and calculates trends
5. **Email**: Sends detailed HTML report with:
   - Current total value in INR
   - 24-hour price change
   - Comparison with previous day
   - 7-day average analysis
   - All-time high/low tracking
   - Recent price history table

## Manual Testing

Visit the web dashboard and click "Send Report Now" to trigger an immediate email report.

## API Endpoints

- `GET /api/status` - Check system status
- `GET /api/history` - Get price history
- `POST /api/trigger` - Manually trigger price report
- `GET /api/cron` - Cron endpoint (called by Vercel)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Nodemailer (email sending)
- Axios (API requests)
- CoinGecko API (price data)
