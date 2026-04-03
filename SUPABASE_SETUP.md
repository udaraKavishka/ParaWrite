# Supabase Setup Guide

This guide explains how to set up Supabase for enhanced PDF processing in ParaWrite.

## Overview

ParaWrite uses a **two-tier PDF parsing strategy**:

1. **Client-side (Primary)**: Uses `pdf-parse` library - works automatically without setup
2. **Server-side (Fallback)**: Uses Supabase Edge Function - requires configuration

## Why Use Supabase?

- **Better Compatibility**: Handles complex PDF formats that may fail client-side
- **Automatic Fallback**: If client-side parsing fails, server-side takes over
- **Future-proof**: Ready for OCR support for scanned documents

## Prerequisites

- A Supabase account (free tier works)
- Supabase CLI installed
- Node.js v18+ and npm

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: ParaWrite (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait for setup to complete (~2 minutes)

## Step 2: Get API Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Navigate to **API** section
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbG...`)

## Step 3: Configure Environment Variables

1. In your ParaWrite project root, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Important**: Add `.env` to `.gitignore` (if not already there):
   ```bash
   echo ".env" >> .gitignore
   ```

## Step 4: Install Supabase CLI

### macOS
```bash
brew install supabase/tap/supabase
```

### Windows
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Linux
```bash
brew install supabase/tap/supabase
```

### Alternative (NPM)
```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

## Step 5: Login to Supabase CLI

```bash
supabase login
```

This will:
1. Open your browser
2. Ask you to authorize the CLI
3. Return to terminal once authenticated

## Step 6: Deploy the Edge Function

1. Get your project reference ID:
   - Go to your Supabase dashboard
   - Settings → General → Reference ID
   - Copy the ID (looks like `abcdefghijklmn`)

2. Deploy the parse-pdf function:
   ```bash
   cd /path/to/ParaWrite
   supabase functions deploy parse-pdf --project-ref your-project-ref-id
   ```

3. Wait for deployment (~30 seconds)

4. Verify deployment:
   ```bash
   supabase functions list --project-ref your-project-ref-id
   ```

Expected output:
```
┌──────────────┬──────────┬─────────┬──────────────────┐
│ NAME         │ STATUS   │ REGION  │ UPDATED          │
├──────────────┼──────────┼─────────┼──────────────────┤
│ parse-pdf    │ ACTIVE   │ us-east │ 2 minutes ago    │
└──────────────┴──────────┴─────────┴──────────────────┘
```

## Step 7: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser

3. Try uploading a PDF file

4. Check browser console (F12 → Console) for logs:
   - Should see "Loading pdf-parse library..."
   - If client-side fails: "Client-side PDF parsing failed, trying Supabase function..."
   - If successful: "PDF text extracted, length: XXX"

## Troubleshooting

### Error: "Function not found"

**Solution**: Check your project reference ID and redeploy:
```bash
supabase functions deploy parse-pdf --project-ref your-correct-ref-id
```

### Error: "Authorization failed"

**Solution**: Verify your environment variables:
```bash
# Check .env file exists and has correct values
cat .env

# Restart dev server
npm run dev
```

### Error: "CORS error"

**Solution**: The edge function includes CORS headers. If you still get errors:
1. Check Supabase dashboard → Edge Functions → parse-pdf → Logs
2. Verify the function deployed successfully
3. Try redeploying the function

### PDF parsing still fails

**Solutions**:
1. **Check PDF file**: Some PDFs are scanned images (no text)
   - Try opening in a PDF viewer and selecting text
   - If you can't select text, it's a scanned image (needs OCR - not supported yet)

2. **Convert to DOCX**: Use online converters:
   - [CloudConvert](https://cloudconvert.com/pdf-to-docx)
   - [Zamzar](https://www.zamzar.com/convert/pdf-to-docx/)

3. **Check logs**: Browser console and Supabase edge function logs

## Edge Function Monitoring

View function logs in real-time:
```bash
supabase functions logs parse-pdf --project-ref your-project-ref-id
```

Or in the dashboard:
- Go to Edge Functions → parse-pdf → Logs

## Cost Estimation

**Free Tier Limits**:
- 500,000 Edge Function invocations per month
- 400,000 Edge Function GB-hours per month

**Typical Usage**:
- Small PDF (1-10 pages): ~1-2 seconds
- Medium PDF (10-50 pages): ~3-5 seconds
- Large PDF (50+ pages): ~5-10 seconds

**Example**: Processing 100 PDFs per day (average 20 pages each):
- ~3,000 invocations per month
- Well within free tier

## Production Deployment

### Environment Variables in Production

For Vercel/Netlify/Other hosts:

1. Add environment variables in your hosting dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

2. Rebuild and redeploy your app

### Security Best Practices

1. **Never commit .env**: Always in `.gitignore`
2. **Use anon key only**: Don't use service role key in frontend
3. **Row Level Security**: If you add database tables, enable RLS
4. **Rate limiting**: Consider adding rate limits in production

## Alternative: Run Without Supabase

PDF files will work using client-side `pdf-parse` library:

**Advantages**:
- No setup required
- Works offline
- No external dependencies

**Limitations**:
- May fail on complex PDFs
- No OCR support for scanned documents
- Slightly slower for large PDFs

**Recommendation**: Start without Supabase, add it only if you encounter PDF parsing issues.

## Support

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Edge Functions Guide**: [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)
- **ParaWrite Issues**: [https://github.com/udara/ParaWrite/issues](https://github.com/udara/ParaWrite/issues)

## Next Steps

Once Supabase is configured:
1. Test with various PDF files
2. Monitor edge function logs
3. Consider adding OCR support for scanned documents (future enhancement)
4. Set up analytics to track PDF processing success rate
