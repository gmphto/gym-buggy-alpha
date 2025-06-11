# PureGym Scraper Scripts

This directory contains scripts to find and import all PureGym locations across the UK into your gym-buddy database.

## 🚀 Quick Start

```bash
# Basic scraper (uses fallback data)
npm run scrape:puregym

# Enhanced scraper (uses multiple APIs + fallback data)
npm run scrape:puregym:enhanced
```

## 📁 Files Overview

- **`puregym-scraper.ts`** - Basic scraper with fallback data
- **`enhanced-puregym-scraper.ts`** - Advanced scraper using multiple data sources
- **`puregym-data.ts`** - Fallback data with 44+ known PureGym locations
- **`README.md`** - This documentation file

## 🛠️ Setup Requirements

### Required Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Required for database access
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional for enhanced scraper
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

### Database Setup

Ensure your Supabase database has the `gyms` table set up according to the schema in `supabase/migrations/20241209_initial_schema.sql`.

## 📊 Scraper Comparison

| Feature               | Basic Scraper      | Enhanced Scraper        |
| --------------------- | ------------------ | ----------------------- |
| **Fallback Data**     | ✅ 44+ locations   | ✅ 44+ locations        |
| **Web Scraping**      | ✅ PureGym website | ❌ Not included         |
| **Google Places API** | ❌ Not included    | ✅ Comprehensive search |
| **OpenStreetMap**     | ❌ Not included    | ✅ OSM/Overpass API     |
| **Duplicate Removal** | ❌ Basic           | ✅ Advanced algorithm   |
| **Data Sources**      | 1-2 sources        | 3+ sources              |
| **Reliability**       | Good               | Excellent               |

## 🎯 Basic Scraper (`puregym-scraper.ts`)

The basic scraper attempts multiple methods to find PureGym locations:

1. **PureGym API** - Tries to fetch from their internal API
2. **Website Scraping** - Scrapes individual gym pages
3. **Fallback Data** - Uses curated list of 44+ known locations

### Usage

```bash
npm run scrape:puregym
```

### Features

- ✅ Zero external dependencies (no API keys required)
- ✅ Respectful scraping with delays
- ✅ Comprehensive error handling
- ✅ Fallback data ensures you always get results
- ✅ Follows project's Zod validation patterns

## 🚀 Enhanced Scraper (`enhanced-puregym-scraper.ts`)

The enhanced scraper uses multiple data sources for maximum coverage:

1. **Google Places API** - Searches major UK cities for PureGyms
2. **OpenStreetMap** - Uses Overpass API for crowdsourced data
3. **Fallback Data** - Curated list as backup

### Usage

```bash
# Set up Google Places API key (optional but recommended)
export GOOGLE_PLACES_API_KEY=your_api_key

npm run scrape:puregym:enhanced
```

### Features

- ✅ Multiple data sources for comprehensive coverage
- ✅ Advanced duplicate detection and removal
- ✅ Detailed source attribution
- ✅ Works without API keys (uses OSM + fallback data)
- ✅ Enhanced error handling and recovery

## 📍 Fallback Data Coverage

The fallback data includes PureGym locations in major UK cities:

- **London** (Bank, Liverpool Street, etc.)
- **Manchester** - City Centre
- **Birmingham** - City Centre
- **Leeds** - City Centre
- **Glasgow** - City Centre
- **Edinburgh** - City Centre
- **Liverpool** - City Centre
- **Bristol** - City Centre
- **Newcastle** - City Centre
- **Sheffield** - City Centre
- **Cardiff** - City Centre
- **Belfast** - City Centre
- **And 30+ more locations across the UK**

## 🔧 Customization

### Adding More Fallback Locations

Edit `puregym-data.ts` and add new locations to the array:

```typescript
{
  name: "PureGym Your City",
  address: "123 High Street, Your City, Postcode",
  latitude: 51.5074,
  longitude: -0.1278,
  amenities: getDefaultPureGymAmenities()
}
```

### Modifying Default Amenities

Update the `getDefaultPureGymAmenities()` function in `puregym-data.ts`:

```typescript
export function getDefaultPureGymAmenities(): string[] {
  return [
    "Weights",
    "Cardio Equipment",
    "Functional Training Area",
    "Free Wi-Fi",
    "24/7 Access",
    "Your Custom Amenity",
  ];
}
```

## 🐛 Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**

- Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

**"Google Places API key not found"**

- This is just a warning. The enhanced scraper will use other data sources
- Add `GOOGLE_PLACES_API_KEY` to `.env.local` for full functionality

**"No gyms found"**

- The scripts include fallback data, so this shouldn't happen
- Check your internet connection and Supabase setup

**Database permission errors**

- Ensure your `SUPABASE_SERVICE_ROLE_KEY` has write permissions
- Check your RLS policies in Supabase

### Debug Mode

Add debug logging by modifying the console.log statements in the scraper files.

## 📈 Performance

- **Basic Scraper**: ~1-3 minutes (depending on scraping success)
- **Enhanced Scraper**: ~2-5 minutes (with all APIs)
- **Database Insertion**: ~10-30 seconds for 50+ gyms

## 🔒 Compliance & Ethics

These scripts:

- ✅ Use respectful delays between requests
- ✅ Include proper User-Agent headers
- ✅ Gracefully handle rate limiting
- ✅ Provide fallback data to reduce scraping load
- ✅ Follow robots.txt guidelines where applicable

## 🛡️ Error Handling

Both scripts include comprehensive error handling:

- Individual gym failures won't stop the entire process
- Network timeouts are gracefully handled
- Database errors are properly reported
- Fallback data ensures you always get results

## 📝 Schema Compliance

Both scripts follow the project's architecture rules:

- ✅ Use Zod schemas for data validation
- ✅ Include proper TypeScript typing
- ✅ Follow pure function patterns where possible
- ✅ Implement proper error boundaries

## 🚀 Next Steps

After running the scraper:

1. **Verify Data**: Check your Supabase dashboard to confirm gyms were inserted
2. **Test API**: Use your gym API endpoints to search for PureGyms
3. **Update Regularly**: Run monthly to catch new gym openings
4. **Extend Coverage**: Add other gym chains using similar patterns

## 📞 Support

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your environment variables are set correctly
3. Ensure your Supabase database schema matches the migration
4. Check that your internet connection allows API requests

The fallback data ensures you'll always have a good starting set of PureGym locations even if external APIs fail.
