# Web Scraper Test Cases

## Basic Tests (No Puppeteer needed)

### Test 1: Simple Static Site
- **URL**: `https://example.com`
- **CSS Selector**: `h1`
- **Expected Result**: "Example Domain"

### Test 2: Multiple Elements
- **URL**: `https://httpbin.org/html`
- **CSS Selector**: `p`
- **Expected Result**: Multiple paragraph elements

### Test 3: Class Selector
- **URL**: `https://httpbin.org/html`
- **CSS Selector**: `.lead`
- **Expected Result**: Lead paragraph text

## Advanced Tests (Puppeteer recommended)

### Test 4: YouTube (JavaScript-heavy)
- **URL**: `https://www.youtube.com`
- **CSS Selector**: `#video-title`
- **Puppeteer**: ✅ Enabled
- **Expected Result**: Video title elements

### Test 5: XPath Test
- **URL**: `https://example.com`
- **Selector Type**: XPath
- **XPath**: `//h1`
- **Expected Result**: Same as CSS selector `h1`

### Test 6: Attribute Selector
- **URL**: `https://httpbin.org/html`
- **CSS Selector**: `a[href]`
- **Expected Result**: All links with href attributes

## Troubleshooting Tips

1. **Start with simple sites** (example.com, httpbin.org)
2. **Use Puppeteer for JavaScript-heavy sites** (YouTube, social media)
3. **Inspect elements** in browser dev tools to find correct selectors
4. **Check the console** for any error messages
