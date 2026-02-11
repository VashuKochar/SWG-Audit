# OG Image Creation Guide

Generate a social sharing image (og-image.png) for SWG Audit.

## Specifications

- **Size:** 1200px × 630px (Facebook/Twitter recommended)
- **Format:** PNG or JPEG
- **File size:** < 1MB (< 300KB recommended)
- **Aspect ratio:** 1.91:1

## Content

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   🛡️                                                        │
│                                                             │
│                      SWG AUDIT                             │
│                                                             │
│         Test Your Web Security. Get Evidence.              │
│                                                             │
│   ✓ Phishing  ✓ Malware  ✓ Data Theft  ✓ Cyberslacking   │
│                                                             │
│                  www.swgaudit.com                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Elements

**Background:**
- Gradient: Dark blue (#0a1929) to lighter blue (#1e3a5f)
- OR: Clean white (#ffffff) with subtle grid pattern

**Typography:**
- Title "SWG AUDIT": Bold, 72-80px, sans-serif (Inter, Work Sans, or Roboto)
- Subtitle: Regular, 36-40px
- Checkmarks: 28-32px
- Domain: 24px, muted color

**Colors:**
- Primary: #0066cc (blue from site)
- Text on dark: #ffffff
- Text on light: #1a1a1a
- Accent: #4d9fff (lighter blue for contrast)

**Icons:**
- Use emoji (🛡️ ✓) or simple SVG icons
- Shield icon at top (security theme)
- Checkmarks before each simulation category

### Tools

**Option 1: Canva (Easiest)**
1. Go to canva.com
2. Create design → Custom size → 1200 × 630 px
3. Add gradient background
4. Add text layers with content above
5. Download as PNG

**Option 2: Figma (Professional)**
1. Create new file, frame 1200×630
2. Design as specified above
3. Export as PNG (@2x for retina)

**Option 3: ImageMagick (Command Line)**
```bash
convert -size 1200x630 gradient:#0a1929-#1e3a5f \
  -gravity center \
  -pointsize 80 -fill white -annotate +0-150 "SWG AUDIT" \
  -pointsize 40 -annotate +0-50 "Test Your Web Security. Get Evidence." \
  -pointsize 32 -annotate +0+50 "✓ Phishing  ✓ Malware  ✓ Data Theft  ✓ Cyberslacking" \
  -pointsize 24 -fill "#aaaaaa" -annotate +0+150 "www.swgaudit.com" \
  og-image.png
```

**Option 4: Online Generators**
- https://www.opengraph.xyz/
- https://www.bannerbear.com/tools/social-image-generator/

## Current Placeholder

The current `og-image.png` is a placeholder. Replace it with a branded image using the guide above.

## Testing

After creating the image:

1. **Place file:** Save as `public/images/og-image.png`
2. **Build:** Run `npm run build`
3. **Test with Facebook Debugger:** https://developers.facebook.com/tools/debug/
4. **Test with Twitter Card Validator:** https://cards-dev.twitter.com/validator
5. **Test with LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

## Checklist

- [ ] Image created (1200×630px)
- [ ] File saved as `og-image.png`
- [ ] File size < 300KB
- [ ] Tested on Facebook debugger
- [ ] Tested on Twitter card validator
- [ ] Looks good on both light and dark UI

## Alternative: Dynamic OG Images

For per-page OG images (e.g., different image for each simulation category):

1. Generate 4 category-specific images:
   - `og-phishing.png`
   - `og-malware.png`
   - `og-data-theft.png`
   - `og-cyberslacking.png`

2. Update templates to use category-specific images:
   ```html
   <meta property="og:image" content="https://www.swgaudit.com/images/og-{{category}}.png">
   ```

3. Fallback to generic `og-image.png` for homepage and static pages.
