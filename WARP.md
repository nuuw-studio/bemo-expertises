# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a static website built with Decap CMS, Eleventy, Alpine.js, and Tailwind CSS. The site is deployed to Netlify and uses Decap CMS for content management.

**Tech Stack:**
- **Eleventy** (v3.0.0-alpha.6): Static site generator
- **Decap CMS**: Git-based CMS for content management
- **Alpine.js**: Lightweight JavaScript framework for interactivity
- **Tailwind CSS**: Utility-first CSS framework with custom theme
- **Preline**: UI components library

## Development Commands

### First-Time Setup
```bash
npm install
npm run build  # Required first time to generate initial CSS
```

### Development
```bash
npm run start  # Runs Eleventy, Tailwind CSS, and BrowserSync in parallel
```
This starts:
- Eleventy with watch mode on port 8080
- Tailwind CSS compiler in watch mode
- BrowserSync server at http://localhost:8080

### Building for Production
```bash
npm run build  # Builds Eleventy site and compiles production CSS
```

### Individual Tasks
```bash
npm run eleventy      # Run Eleventy with watch mode only
npm run css           # Run Tailwind CSS compiler in watch mode only
npm run browsersync   # Run BrowserSync server only
npm run debug         # Run Eleventy with DEBUG=* for troubleshooting
```

### Content Management
For local CMS development:
```bash
npx decap-server  # Start local Decap CMS backend
```
Then access the CMS at http://localhost:8080/admin/

## Architecture

### Directory Structure
- **`src/`**: Source files
  - **`_data/`**: Global data files (YAML) for navigation, settings, quick links
  - **`_includes/`**: Nunjucks templates and partials (layouts, components)
  - **`admin/`**: Decap CMS configuration
  - **`blog/`**: Blog posts (Markdown files with frontmatter)
  - **`static/`**: Static assets (CSS, JS, images, fonts, favicon)
- **`_site/`**: Generated output directory (git-ignored)
- **`.eleventy.js`**: Eleventy configuration
- **`tailwind.config.js`**: Tailwind CSS configuration with custom theme
- **`postcss.config.js`**: PostCSS configuration

### Eleventy Configuration (`.eleventy.js`)
- **Input directory**: `src/`
- **Template engine**: Nunjucks for HTML files
- **Data format**: Supports YAML in `_data/` directory
- **Image processing**: Uses `@11ty/eleventy-img` plugin with WebP + JPEG formats at 400/800/1200px widths
- **HTML minification**: Enabled for production builds
- **Custom filter**: `readableDate` for date formatting using Luxon

### Tailwind Configuration
Custom color palette:
- **darkblue**: `#1f5173`
- **green**: `#7be495`
- **bluegreen**: `#309d9c`
- **offwhite**: `#d1e8ce`
- **primary**: Blue scale (50-950)

Custom fonts:
- **Sans/Body**: Outfit (Variable)
- **Serif**: Bespoke Slab (Variable)

Font files located in `src/static/fonts/`.

### Content Management with Decap CMS
- **Configuration**: `src/admin/config.yml`
- **Backend**: Git Gateway (Netlify Identity)
- **Media folder**: `src/static/img`
- **Collections**:
  - **Pages**: Homepage (index.html) with team members
  - **Blog**: Posts stored in `src/posts/` (Markdown with frontmatter)
  - **Settings**: Navigation, quick links, meta settings (all YAML files in `_data/`)

### Template System
- **Base layout**: `src/_includes/default.html` - includes navbar, footer, Alpine.js, Preline, and FontAwesome
- **Blog layout**: `src/_includes/blog.html` - for blog listing pages
- **Posts layout**: `src/_includes/posts.html` - for individual blog posts
- **Partials**: Located in `src/_includes/partials/` (navbar, footer, hero, features, contact, content)

### Blog Posts
- Posts are Markdown files in `src/blog/` directory
- Use frontmatter for metadata (title, description, author, date, tags)
- Posts inherit layout from `src/blog/posts.json` which sets layout to "posts" and adds "post" tag
- Tagged with "post" for collection purposes

### Styling
- **Source CSS**: `src/static/css/tailwind.css`
- **Output CSS**: `_site/static/css/style.css`
- Tailwind processes all `.html`, `.njk`, `.md`, `.scss` files and Preline components
- Preline plugin adds UI component utilities

## Deployment

The site deploys to Netlify:
- **Build command**: `npm run build`
- **Publish directory**: `_site`
- Configuration in `netlify.toml`

## Key Conventions

### Adding New Pages
1. Create HTML/Markdown file in `src/` directory
2. Add frontmatter with layout (typically "default" or "blog")
3. If needed, add to navigation in `src/_data/navigation.yaml`

### Adding New Blog Posts
1. Create Markdown file in `src/blog/`
2. Include required frontmatter: title, description, author, date
3. Optionally add tags for categorization
4. Or use Decap CMS at `/admin` to create posts via UI

### Modifying Data
Global site data lives in `src/_data/` as YAML files:
- `settings.yaml`: Site name, author, URL
- `navigation.yaml`: Main navigation links
- `quicklinks.yaml`: Footer/quick access links

### Working with Images
- Images stored in `src/static/img/`
- Eleventy automatically optimizes images in HTML to WebP + JPEG
- Generates responsive sizes (400, 800, 1200px widths)
- Lazy loading enabled by default

### JavaScript
- **Alpine.js**: Available globally, loaded from `node_modules` via passthrough copy
- **Preline**: UI component JavaScript, copied to `static/js/`
- Custom JS can be added to `src/static/js/`

## Notes

- Eleventy ignores `.gitignore` by default (configured in `.eleventy.js`)
- Data deep merge is enabled for flexible data inheritance
- HTML template engine is set to Nunjucks even for `.html` files
- BrowserSync runs on port 8080 without notifications or auto-open
- FontAwesome Kit ID: `94261065ba` (loaded from CDN)
