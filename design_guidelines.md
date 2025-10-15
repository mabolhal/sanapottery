# Design Guidelines: Artisan Pottery E-Commerce Website

## Design Approach
**Reference-Based Approach** drawing inspiration from premium e-commerce platforms (Shopify, Etsy) combined with minimalist art portfolio aesthetics (Squarespace creative templates). The design prioritizes showcasing handcrafted pottery through generous whitespace, refined typography, and an elegant color palette that complements natural ceramics.

## Core Design Principles
1. **Refined Minimalism**: Let pottery pieces breathe with ample negative space
2. **Material Authenticity**: Design elements that echo ceramic textures and earth tones
3. **Bilingual Elegance**: Seamless French/English integration without visual clutter
4. **Touch of Craft**: Subtle organic elements balanced with modern precision

## Color Palette

**Light Mode:**
- Background: 40 8% 98% (warm cream)
- Surface: 0 0% 100% (pure white)
- Primary: 25 40% 35% (terracotta brown)
- Text Primary: 30 15% 20% (warm charcoal)
- Text Secondary: 30 10% 45% (soft brown-gray)
- Accent: 160 30% 40% (sage green)
- Border: 30 15% 88% (light warm gray)

**Dark Mode:**
- Background: 30 12% 12% (deep warm black)
- Surface: 30 10% 18% (elevated dark surface)
- Primary: 25 50% 65% (warm terracotta)
- Text Primary: 40 15% 92% (warm off-white)
- Text Secondary: 40 10% 70% (muted warm gray)
- Accent: 160 25% 55% (sage green)
- Border: 30 8% 28% (subtle border)

## Typography

**Font Families:**
- Display/Headings: "Playfair Display" (serif) - elegant, artistic
- Body Text: "Inter" (sans-serif) - clean, readable
- Accents/Labels: "Montserrat" (sans-serif) - modern refinement

**Type Scale:**
- Hero Headline: text-6xl md:text-7xl font-light tracking-tight
- Section Headings: text-4xl md:text-5xl font-light
- Subsection Headings: text-2xl md:text-3xl font-normal
- Product Titles: text-xl font-medium
- Body Text: text-base leading-relaxed
- Captions: text-sm tracking-wide uppercase

## Layout System

**Spacing Units**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32 for consistent rhythm
- Section padding: py-20 md:py-32
- Component spacing: gap-8 to gap-16
- Container: max-w-7xl mx-auto px-6 md:px-8

## Component Library

### Homepage Components

**Hero Section:**
- Full-width hero with high-quality pottery photography (1920x1080px minimum)
- Overlay with subtle gradient (from transparent to 10% black) for text legibility
- Centered content: elegant headline, brief tagline, primary CTA
- Language toggle (EN/FR) in top-right corner: pill-shaped, subtle, icon + text
- Height: min-h-[85vh] for impact without forcing scroll

**Artist Story Section:**
- Two-column layout (image left, text right on desktop)
- Professional photo of artist at work (800x1000px)
- Storytelling copy with generous line height
- Signature or handwritten accent element

**Featured Collections:**
- Three-column grid on desktop, single column on mobile
- Large square images (600x600px) with subtle hover effect
- Overlay category name on image with translucent background
- Spacing: gap-8 between cards

### Catalogue/Shop Page

**Product Grid:**
- Four columns desktop, two tablet, one mobile
- Product cards with 4:5 aspect ratio images
- Card structure: Image → Title → Price → Quick View/Add to Cart
- Hover state: subtle shadow elevation, image slight zoom (scale-105)

**Filtering System:**
- Sidebar filters on desktop (left), drawer on mobile
- Categories with radio buttons or checkboxes
- Price range slider
- Availability toggle
- Applied filters shown as dismissible chips

**Product Detail Modal/Page:**
- Large image gallery (carousel with thumbnails)
- Product information panel: Title, Price, Description, Dimensions, Materials
- Quantity selector with elegant increment/decrement buttons
- Primary CTA: "Add to Cart" button, full-width on mobile
- Additional info accordion: Care Instructions, Shipping Details

### Shopping Cart & Checkout

**Cart Drawer:**
- Slide-in from right with backdrop blur
- Item rows: thumbnail, title, price, quantity controls, remove
- Subtotal calculation
- Primary CTA: "Proceed to Checkout"

**Checkout Flow:**
- Clean, distraction-free layout
- Progress indicator: Cart → Shipping → Payment → Confirmation
- Left column: form fields, Right column: order summary
- Stripe integration with card element styled to match theme

### Admin CMS Panel

**Dashboard Layout:**
- Sidebar navigation: Products, Orders, Settings
- Card-based metrics: Total Products, Pending Orders, Revenue
- Recent activity feed

**Product Management:**
- Table view with search and filters
- Inline editing capabilities
- Image upload with drag-and-drop (multi-image support)
- Bilingual content fields side-by-side (EN | FR)
- Rich text editor for descriptions

**Order Management:**
- Order cards with status badges (Pending, Shipped, Completed)
- Order timeline with status updates
- Customer information panel
- Action buttons: Mark as Shipped, Send Email

### Navigation & Global Elements

**Header:**
- Transparent on hero, solid on scroll with backdrop blur
- Logo centered or left-aligned
- Navigation: Home, Shop, About, Contact
- Icons: Language toggle, Cart (with count badge)
- Sticky on scroll with smooth transition

**Footer:**
- Three-column layout: About, Quick Links, Newsletter
- Newsletter signup with elegant input + button combo
- Social media icons (Instagram, Pinterest)
- Copyright and secondary links
- Consistent with overall minimalist aesthetic

## Images Strategy

**Required Images:**
1. **Homepage Hero**: Flagship pottery piece or curated collection (landscape, 1920x1080px+)
2. **Artist Portrait**: Professional photo of artist working with clay (800x1000px)
3. **Product Photography**: Clean, well-lit shots on neutral backgrounds (1200x1500px)
4. **Collection Headers**: Lifestyle shots showing pottery in context (1200x800px)
5. **About Page**: Studio shots, process photos (various sizes)

**Image Treatment:**
- Soft shadows for depth
- Consistent lighting and backgrounds
- Subtle vignette on hero images
- Lazy loading for performance

## Animations & Interactions

**Use Sparingly:**
- Smooth scroll behavior
- Fade-in on scroll for sections (subtle, once)
- Product card hover: gentle scale and shadow
- Page transitions: simple fade
- Cart drawer slide-in animation

**Avoid:**
- Parallax effects
- Complex scroll-triggered animations
- Looping animations
- Excessive motion

## Accessibility & Responsiveness

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

**Accessibility:**
- Consistent dark mode across all components including forms
- High contrast ratios (WCAG AAA when possible)
- Focus indicators with visible outline
- Alt text for all images
- Semantic HTML structure
- Keyboard navigation support

**Bilingual Implementation:**
- Language toggle visible on all pages
- Content switches without page reload
- Separate routes for SEO (/en/, /fr/)
- Consistent UI translation for buttons, labels, messages

This design creates a sophisticated, gallery-like experience that elevates handcrafted pottery while maintaining e-commerce functionality. The minimalist aesthetic ensures pottery pieces remain the hero, supported by refined typography and generous whitespace.