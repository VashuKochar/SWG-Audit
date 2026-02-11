# Icons

Current icons:

- `favicon.ico` — Main favicon (multi-size ICO format)
- `apple-touch-icon.png` — Apple touch icon (180×180)
- `logo_swg_audit.png` — Logo for header

## TODO: Add Additional Sizes

For better browser support, generate and add:

- `favicon-32x32.png` — 32×32 PNG
- `favicon-16x16.png` — 16×16 PNG

**Generate from existing favicon.ico:**

```bash
# Install ImageMagick
sudo apt install imagemagick

# Extract/convert
convert favicon.ico[0] -resize 32x32 favicon-32x32.png
convert favicon.ico[0] -resize 16x16 favicon-16x16.png
```

Or use an online tool: https://realfavicongenerator.net/
