# AEM Content Authoring Guide for DEPT Kicks Blocks

## Overview

This guide shows how content editors create pages in AEM using the DEPT Kicks blocks with xwalk integration.

---

## Content Authoring Workflow

### Step 1: Create a New Page in AEM
1. Navigate to **Sites** → **DEPT Kicks** → **New**
2. Select page template (EDS template with block support)
3. Name: `products` (or your page name)
4. Create

### Step 2: Author the Page

The page will have sections where you add **blocks**. Each block corresponds to a component definition.

---

## Block-by-Block Authoring

### 1️⃣ HERO BLOCK

#### In AEM Editor (Visual UI)

| Field | Type | Value | Required |
|-------|------|-------|----------|
| Season Label | Text | New Season Drop — 2026 | No |
| Main Heading | Text | Step into performance | Yes |
| Description | RTE | Curated footwear from... | No |
| CTA Button Text | Text | Shop Collection | No |
| CTA Link Target | Text | #products | No |
| Hero Image | Reference | Select from DAM | No |
| Statistics (Click +) | Repeatable | — | No |

#### Statistics Repeatable Items
Click the **+** button to add each stat:

| Item | Stat Value | Stat Label |
|------|-----------|-----------|
| Stat 1 | 24 | Styles |
| Stat 2 | 6 | Brands |
| Stat 3 | 4 | Categories |
| Stat 4 | Free | Shipping $75+ |

#### Generated AEM Generated (Behind the Scenes)
```html
<div class="block hero" 
     data-season-label="New Season Drop — 2026"
     data-heading="Step into performance"
     data-description="Curated footwear from..."
     data-cta-text="Shop Collection"
     data-cta-link="#products"
     data-image-url="/path/to/image.jpg"
     data-stats='[
       {"stat_value":"24","stat_label":"Styles"},
       {"stat_value":"6","stat_label":"Brands"},
       {"stat_value":"4","stat_label":"Categories"},
       {"stat_value":"Free","stat_label":"Shipping $75+"}
     ]'>
</div>
```

When page renders, the `hero.js` decorate() function reads these data attributes and builds the responsive hero section.

---

### 2️⃣ HEADER BLOCK

#### In AEM Editor (Visual UI)

**Main Fields:**

| Field | Type | Value |
|-------|------|-------|
| Logo Text | Text | DEPT Kicks |
| CTA Button Text | Text | Shop Now |
| CTA Button Link | Text | #products |
| Show Search | Checkbox | ☑ Checked |
| Show Cart Icon | Checkbox | ☑ Checked |
| Show User Account | Checkbox | ☑ Checked |
| Navigation Items (Click +) | Repeatable | — |

**Navigation Items (Repeatable with Sub-Menus):**

For each nav item, click **+** and enter:

| Item | Label | URL | Sub-Items |
|------|-------|-----|-----------|
| Nav 1 | All | /?category=all | — |
| Nav 2 | Running | /?category=running | Optional submenus |
| Nav 3 | Basketball | /?category=basketball | — |
| Nav 4 | Training | /?category=training | — |
| Nav 5 | Lifestyle | /?category=lifestyle | — |

**Sub-Menu Example (for "Running"):**
Click expand under Nav 2 → Click **+** for each submenu:

| Sub-Item | Sub-Label | Sub-URL |
|----------|-----------|---------|
| Sub 1 | Road Running | /?category=running&type=road |
| Sub 2 | Trail Running | /?category=running&type=trail |
| Sub 3 | Lightweight | /?category=running&type=lightweight |

#### Generated HTML (xwalk output)
```html
<div class="block header" 
     data-logo-text="DEPT Kicks"
     data-cta-button-text="Shop Now"
     data-cta-button-href="#products"
     data-show-search="true"
     data-show-cart="true"
     data-show-user="true"
     data-navigation-items='[
       {
         "nav_label":"All",
         "nav_href":"/?category=all",
         "submenu_items":[]
       },
       {
         "nav_label":"Running",
         "nav_href":"/?category=running",
         "submenu_items":[
           {"submenu_label":"Road Running","submenu_href":"/?category=running&type=road"},
           {"submenu_label":"Trail Running","submenu_href":"/?category=running&type=trail"}
         ]
       }
     ]'>
</div>
```

---

### 3️⃣ PRODUCTS BLOCK

#### In AEM Editor (Visual UI)

**Section Settings:**

| Field | Type | Value |
|-------|------|-------|
| Section Title | Text | Featured Products |
| Section Description | RTE | Browse our curated collection... |
| Grid Columns | Select | 4 Columns |
| Category Filters (Click +) | Repeatable | — |
| Product Items (Click +) | Repeatable | — |

**Category Filters (Repeatable):**

Click **+** to add each filter:

| Filter | Filter Name | Filter ID |
|--------|-------------|-----------|
| 1 | All | all |
| 2 | Running | running |
| 3 | Basketball | basketball |
| 4 | Training | training |
| 5 | Lifestyle | lifestyle |

**Product Items (Repeatable with Variants):**

Click **+** for each product:

| Field | Type | Example |
|-------|------|---------|
| Product Name | Text | CloudRunner Pro |
| Product Price | Number | 159.99 |
| Category | Select | Running |
| Product Image | Reference | Select from DAM |
| Description | RTE | Premium running sneakers... |
| Featured Product | Checkbox | ☑ (Yes) |
| Product Variants (Click +) | Repeatable | — |

**Product Variants (Repeatable - under each product):**

Click expand on product → Click **+** for each variant:

| Field | Type | Example |
|-------|------|---------|
| Variant Type | Select | Size / Color / Material |
| Variant Value | Text | 8 / Red / Mesh |

**Example Product Entry:**
```
Product: CloudRunner Pro
├── Name: CloudRunner Pro
├── Price: 159.99
├── Category: Running
├── Image: [DAM image selected]
├── Description: Premium running sneakers with cloud-cushioning
├── Featured: ✓ Yes
└── Variants:
    ├── Size: 8
    ├── Size: 9
    ├── Size: 10
    ├── Size: 11
    ├── Color: Black
    └── Color: White
```

#### Generated HTML (xwalk output)
```html
<div class="block products" 
     data-section-title="Featured Products"
     data-grid-columns="4"
     data-category-filters='[
       {"filter_name":"All","filter_id":"all"},
       {"filter_name":"Running","filter_id":"running"},
       {"filter_name":"Basketball","filter_id":"basketball"}
     ]'
     data-product-items='[
       {
         "product_name":"CloudRunner Pro",
         "product_price":159.99,
         "product_category":"Running",
         "product_image":"/path/to/image.jpg",
         "product_description":"Premium running...",
         "is_featured":true,
         "product_variants":[
           {"variant_type":"Size","variant_value":"8"},
           {"variant_type":"Size","variant_value":"9"},
           {"variant_type":"Color","variant_value":"Black"}
         ]
       },
       {
         "product_name":"Street Elite",
         "product_price":139.99,
         ...
       }
     ]'>
</div>
```

---

### 4️⃣ FOOTER BLOCK

#### In AEM Editor (Visual UI)

**Main Settings:**

| Field | Type | Value |
|-------|------|-------|
| Copyright Text | Text | © 2026 DEPT Kicks... |
| Newsletter Enabled | Checkbox | ☑ Yes |
| Newsletter Placeholder | Text | Enter your email |
| Footer Sections (Click +) | Repeatable | — |
| Social Media Links (Click +) | Repeatable | — |

**Footer Sections (Repeatable):**

Click **+** for each section:

| Section | Title | Links (Repeatable) |
|---------|-------|-------------------|
| 1 | Shop | Click + for each link |
| 2 | Company | Click + for each link |
| 3 | Support | Click + for each link |
| 4 | Legal | Click + for each link |

**Footer Section Links (Repeatable - under each section):**

For "Shop" section, click **+** for each link:

| Link | Text | URL |
|------|------|-----|
| 1 | New Arrivals | /new |
| 2 | Running | /running |
| 3 | Basketball | /basketball |
| 4 | Training | /training |
| 5 | Lifestyle | /lifestyle |

**Social Media Links (Repeatable):**

Click **+** for each social platform:

| Platform | Platform Select | URL |
|----------|-----------------|-----|
| 1 | Twitter / X | https://twitter.com/deptkicks |
| 2 | Instagram | https://instagram.com/deptkicks |
| 3 | Facebook | https://facebook.com/deptkicks |
| 4 | LinkedIn | https://linkedin.com/company/dept |

#### Generated HTML (xwalk output)
```html
<div class="block footer" 
     data-copyright-text="© 2026 DEPT Kicks..."
     data-newsletter-enabled="true"
     data-footer-sections='[
       {
         "section_title":"Shop",
         "section_links":[
           {"link_text":"New Arrivals","link_href":"/new"},
           {"link_text":"Running","link_href":"/running"}
         ]
       },
       {
         "section_title":"Company",
         "section_links":[
           {"link_text":"About Us","link_href":"/about"},
           {"link_text":"Careers","link_href":"/careers"}
         ]
       }
     ]'
     data-social-media='[
       {"platform":"Twitter","social_url":"https://twitter.com/deptkicks"},
       {"platform":"Instagram","social_url":"https://instagram.com/deptkicks"}
     ]'>
</div>
```

---

## Complete Page Example

### Visual Page Structure (as seen in AEM)

```
┌─────────────────────────────────────────┐
│        DEPT Kicks Page Content          │
├─────────────────────────────────────────┤
│  [HERO BLOCK]                           │
│  ├─ Season Label                        │
│  ├─ Heading & Description               │
│  ├─ CTA Button                          │
│  ├─ Hero Image                          │
│  └─ Statistics (4 items)                │
├─────────────────────────────────────────┤
│  [HEADER BLOCK]                         │
│  ├─ Logo: DEPT Kicks                    │
│  ├─ Navigation (5 categories)           │
│  ├─ Cart & Search                       │
│  └─ CTA Button                          │
├─────────────────────────────────────────┤
│  [PRODUCTS BLOCK]                       │
│  ├─ Title & Description                 │
│  ├─ Filters (5 categories)              │
│  ├─ Grid (20 products × 4 cols)         │
│  │  └─ Each product: image, name,       │
│  │     price, variants                  │
│  └─ Add to Cart buttons                 │
├─────────────────────────────────────────┤
│  [FOOTER BLOCK]                         │
│  ├─ Newsletter subscription             │
│  ├─ 4 Link sections (20 links total)    │
│  ├─ Social media (4 platforms)          │
│  └─ Copyright & bottom links            │
└─────────────────────────────────────────┘
```

---

## Content Mapping

### How Authored Content → HTML → Rendered Page

```
Step 1: Author in AEM UI
   ↓
   Editor fills form fields (text, select, repeatable items)
   
Step 2: xwalk Processes with Model
   ↓
   Reads component definition (_hero.json, etc.)
   Validates fields against model
   Serializes to data-* attributes
   
Step 3: Generate HTML
   ↓
<div class="block hero" data-heading="..." data-stats='[...]'>
</div>
   
Step 4: Block JavaScript
   ↓
   hero.js decorate() function runs
   Reads data-* attributes
   Builds responsive DOM structure
   Attaches event listeners
   
Step 5: Apply CSS
   ↓
   hero.css styles the block
   Uses CSS variables from theme.css
   Responsive breakpoints (mobile/tablet/desktop)
   
Step 6: Browser Renders
   ↓
   User sees fully styled, interactive hero section
   ↓
   Same process for header, products, footer blocks
```

---

## Field Validation & Defaults

### Hero Block
- **season_label**: Default = "New Season Drop — 2026"
- **heading**: Required, max 200 chars
- **description**: RTE (rich text), optional
- **cta_text**: Default = "Shop Collection"
- **cta_link**: Should start with # or /
- **stats**: At least 1 stat required for display

### Header Block
- **logo_text**: Required, 50 chars max
- **navigation_items**: Min 2, max 10 nav items
- **submenu_items**: Optional, max 5 per nav
- **show_search/cart/user**: Boolean toggles

### Products Block
- **section_title**: Required
- **products**: Min 1 required
- **product_price**: Must be numeric
- **variants**: Optional, max 20 per product
- **grid_columns**: Must be 2-5

### Footer Block
- **copyright_text**: Required
- **sections**: Min 2 required
- **social_media**: Optional, max 10 platforms

---

## Error Handling

If an editor makes mistakes, here's how blocks handle it:

| Error | Handling |
|-------|----------|
| Missing required field | Block shows placeholder or hides optional section |
| Invalid JSON in repeatable | Uses previous valid data or defaults |
| Missing image reference | Shows gray placeholder box |
| Invalid price (not number) | Shows error, reverts to 0 |
| Broken URL | Link still renders, goes nowhere on click |

---

## Publishing & Delivery

### Author's View (in AEM)
```
Page: /content/dept-kicks/products
├─ Hero block (complete)
├─ Header block (complete)
├─ Products block (complete)
└─ Footer block (complete)
```

### Editor Clicks "Publish"
```
1. AEM validates all block fields
2. xwalk renders block HTML with data-* attributes
3. Page published to CDN/delivery tier
4. HTML includes block scripts and CSS references
5. User visits page in browser
6. Block JS initializes automatically
7. Fully functional, styled page rendered
```

---

## Multi-Language Support (Future)

If translations needed, xwalk can handle:
- `data-heading-en: "..."`
- `data-heading-es: "..."`
- `data-heading-fr: "..."`

JavaScript pick based on site language setting.

---

## A/B Testing Support (Future)

Editors could create variants:

```html
<!-- Variant A -->
<div class="block hero" data-variant="a">
  <data-heading>Best New Shoes</data-heading>
  ...
</div>

<!-- Variant B -->
<div class="block hero" data-variant="b">
  <data-heading>Limited Edition Kicks</data-heading>
  ...
</div>
```

JavaScript would load correct variant based on test assignment.

---

## Content Versioning

xwalk automatically tracks:
- Created date
- Last modified
- Author name
- Version history
- Rollback capability

---

## Next Steps for Implementation

1. **Install xwalk plugin** in your AEM instance
2. **Upload block JSON definitions** (_hero.json, etc.)
3. **Create page template** with block zones
4. **Train editors** on authoring workflow
5. **Create sample pages** following guides above
6. **Test publishing** to delivery tier
7. **Verify block rendering** in browser

---

## Editor Quick Checklist

When creating a page:

- [ ] **Hero**: Season label, Heading, Description, CTA, Image, 3-4 Stats
- [ ] **Header**: Logo, 5 Nav items, CTA button, Toggles (search/cart/user)
- [ ] **Products**: Title, 5 Category filters, 15-20 Products with variants
- [ ] **Footer**: Copyright, 4 Link sections (5 links each), 4 Social links
- [ ] **Review**: All blocks show on preview
- [ ] **Test Links**: Click CTA, filters, social links
- [ ] **Mobile Check**: Hamburger menu, responsive grid
- [ ] **Publish**: Save and publish to live

---

**Ready to author!** 🚀
