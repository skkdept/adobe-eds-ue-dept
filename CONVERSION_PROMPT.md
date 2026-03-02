# DEPT Kicks: React to EDS Blocks Conversion Prompt

## 📋 Project Overview
Convert the DEPT Kicks React application (TypeScript, Tailwind CSS, Radix UI) into an Adobe Experience Design System (EDS) compatible site with **advanced, nested-model authoring** - allowing content editors to compose complex multi-level content structures directly in AEM.

### Current State
- **Source**: `/dept-kicks/src/app/` - React/TypeScript application
- **Target**: `/blocks/` - EDS block structure with **advanced authoring (nested models)**
- **Styling**: Tailwind CSS → Native CSS modules
- **Interactions**: React state management → Vanilla JavaScript
- **Content**: Hardcoded in React → **AEM autherable with complex nested content structures**

### Key Reference Structures
- Existing EDS blocks: `/blocks/{block-name}/` containing `_*.json`, `.js`, `.css`
- Component models: `/models/` with JSON Schema definitions
- AEM integration: xwalk plugin system for Franklin/AEM authoring

---

## 🎯 Conversion Strategy

### Phase 1: Block Inventory & Architecture Planning
**Identify what blocks are needed:**

| Component | Block Name | Type | Priority |
|-----------|-----------|------|----------|
| Hero | `hero` | Hero/Banner | P0 |
| Header | `header` | Navigation | P0 |
| ProductsSection | `products` | Grid/Container | P0 |
| ProductCard | `card` | Item Card | P1 |
| Cart | `cart` | Sidebar/Modal | P1 |
| Footer | `footer` | Footer | P1 |

**Block Structure:**
```
blocks/{block-name}/
├── _{block-name}.json     # AEM definition & model
├── {block-name}.js        # Vanilla JS functionality
├── {block-name}.css       # Styling (post-process from Tailwind)
└── README.md             # Block documentation
```

---

### Phase 2: Model Definition & AEM Authoring Schema (Advanced - Nested Models)

**Authoring Complexity**: Advanced with nested models allowing editors to compose complex content structures with repeatable items and component variants.

**Pattern for `_{block-name}.json`:**
```json
{
  "definitions": [
    {
      "title": "Block Display Name",
      "id": "block-id",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "Block Name",
              "filter": "block-id"
            }
          }
        }
      }
    },
    {
      "title": "Nested Item (e.g., Card, Nav Item)",
      "id": "nested-item-id",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block/item",
            "template": {
              "name": "Item Name",
              "model": "nested-item-model"
            }
          }
        }
      }
    }
  ],
  "models": [
    {
      "id": "block-model",
      "fields": [
        {
          "component": "text|richtext|reference|select|checkbox|component",
          "name": "fieldName",
          "label": "Display Label",
          "valueType": "string|number|boolean|object",
          "value": "default",
          "multi": false,
          "required": false
        },
        {
          "component": "component",
          "name": "items",
          "label": "Repeatable Items",
          "valueType": "object",
          "multi": true,
          "fields": [{ "extends": "nested-item-model" }],
          "required": false
        }
      ]
    },
    {
      "id": "nested-item-model",
      "fields": [
        {
          "component": "text|richtext|reference|select",
          "name": "nestedFieldName",
          "label": "Nested Field",
          "valueType": "string|object",
          "required": false
        }
      ]
    }
  ]
}
```

**Requirements per block:**

#### Hero Block
- **Main Model**: `hero`
- **Nested Models**: `stat-item`
- **Fields**: 
  - `heading` (text) - Main headline
  - `subheading` (text) - Secondary text
  - `description` (richtext) - Call-to-action text
  - `cta_text` (text) - Button label
  - `cta_link` (text) - Button URL
  - `image` (reference) - Hero image
  - `stats` (component, multi) - Array of stat items
    - `stat_value` (text) - Number/metric
    - `stat_label` (text) - Label text
- **Authoring Complexity**: Editors can add/remove stats dynamically

#### Header Block
- **Main Model**: `header`
- **Nested Models**: `nav-item`, `cta-button`
- **Fields**:
  - `logo_text` (text) - Brand name
  - `navigation_items` (component, multi) - Repeatable nav links
    - `nav_label` (text) - Link text
    - `nav_url` (text) - Link URL
    - `nav_submenu` (component, multi) - Optional submenu items
  - `cta_button` (component) - Single CTA button
    - `button_text` (text)
    - `button_url` (text)
- **Authoring Complexity**: Editors build navigation structure with optional submenus

#### Products Block
- **Main Model**: `products`
- **Nested Models**: `product-item`, `category-filter`
- **Fields**:
  - `title` (text) - Section heading
  - `description` (richtext) - Section description
  - `filter_categories` (component, multi) - Repeatable category filters
    - `category_name` (text)
    - `category_id` (text)
  - `products` (component, multi) - Repeatable product references
    - `product_reference` (reference) - Link to product model
    - `featured` (checkbox) - Pin to top
    - `override_price` (number) - Optional price override
- **Authoring Complexity**: Editors compose product lists with filters and featured items

#### Product Card (Item Template)
- **Item Model**: `product-card` (used as reference from Products)
- **Fields**:
  - `name` (text) - Product name
  - `price` (number) - Product price
  - `category` (select) - Product category selector
  - `image` (reference) - Product image
  - `description` (richtext) - Product description
  - `variants` (component, multi) - Size/color options
    - `variant_type` (select) - e.g., "Size", "Color"
    - `variant_value` (text) - e.g., "8", "Red"
- **Authoring Complexity**: Editors define product variants

#### Cart Block
- **Main Model**: `cart`
- **Nested Models**: `cart-item`, `shipping-option`
- **Fields**:
  - `cart_items` (component, multi) - Line items (auto-populated from session)
    - `product_ref` (reference) - Link to product
    - `quantity` (number) - Editable quantity
    - `price` (number) - Read-only unit price
  - `shipping_options` (component, multi) - Available shipping methods
    - `shipping_name` (text) - e.g., "Standard", "Express"
    - `shipping_cost` (number) - Cost in dollars
    - `shipping_days` (text) - Delivery timeframe
  - `subtotal` (number, calculated) - Automatically computed
  - `tax` (number, calculated) - Read-only
- **Authoring Complexity**: Editors configure shipping options; items auto-calculated

#### Footer Block
- **Main Model**: `footer`
- **Nested Models**: `footer-section`, `footer-link`, `social-link`
- **Fields**:
  - `copyright_text` (text) - Copyright notice
  - `sections` (component, multi) - Link sections
    - `section_title` (text)
    - `links` (component, multi) - Repeatable links within section
      - `link_text` (text)
      - `link_url` (text)
  - `social_media` (component, multi) - Social media links
    - `platform` (select) - Twitter, Instagram, LinkedIn, etc.
    - `social_url` (text) - Full profile URL
  - `newsletter_enabled` (checkbox) - Show email signup
- **Authoring Complexity**: Editors create complex footer structure with multiple sections

---

### Phase 3: Vanilla JavaScript Conversion

**Principles:**
1. Use data attributes (`data-*`) for block configuration
2. Initialize blocks from HTML structure after render
3. Use Web Components where appropriate for encapsulation
4. No build step required for JS (EDS pattern)
5. Minimal dependencies (vanilla JS + optional microlibs)

**Standard Block Initialization Pattern:**
```javascript
/**
 * Creates and initializes {BlockName} block
 * @param {HTMLElement} block - The block element
 */
export async function decorate(block) {
  // 1. Parse HTML structure
  // 2. Extract configuration from data attributes
  // 3. Initialize event listeners
  // 4. Load external data if needed (fetch products, etc.)
  // 5. Render/transform DOM if necessary
}

// Auto-initialize if EDS envelope is present
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.block.{block-name}').forEach(decorate);
  });
} else {
  document.querySelectorAll('.block.{block-name}').forEach(decorate);
}
```

---

### Phase 4: CSS Conversion Strategy

**From Tailwind to Native CSS:**
1. Extract class definitions and convert to CSS variables/modules
2. Use CSS custom properties (--dept-orange, --spacing-unit, etc.)
3. Leverage modern CSS (Grid, Flexbox, CSS Vars)
4. Maintain responsive design with media queries
5. Support dark mode through CSS variables

**Theme Variables Location:**
- Define in: `/styles/theme.css`
- Reference original Tailwind config from dept-kicks

**CSS File Pattern:**
```css
/* Block-specific variables */
:root {
  --{block-name}-bg: var(--dept-bg);
  --{block-name}-text: var(--dept-text);
}

/* Block structure */
.{block-name} { /* declaration */ }
.{block-name} > * { /* child styles */ }

/* Responsive */
@media (max-width: 768px) {
  .{block-name} { /* mobile styles */ }
}
```

---

### Phase 5: Content Authoring Integration

**Authoring Workflow:**
1. **Content Editor** creates/edits content in AEM
2. **xwalk** processes template + model → HTML
3. **Generated HTML** matches block structure expected by JS
4. **EDS Scripts** recognize block class and call `decorate()`
5. **JS Enhancement** adds interactivity as needed

**HTML Output Example (from AEM):**
```html
<div class="hero block" data-heading="Step into Performance" data-image-url="..." data-stats="[...]">
  <!-- Authored content goes here -->
  <h1>Step into Performance</h1>
  <p>Curated footwear...</p>
  <button>Explore Now</button>
</div>
```

---

## 📦 Conversion Checklist

### For Each Block:

- [ ] **Definition JSON** (`_{block}.json`)
  - [ ] Component definition with xwalk
  - [ ] Model definitions for all fields
  - [ ] Field validation rules
  - [ ] Default values

- [ ] **JavaScript** (`{block}.js`)
  - [ ] `decorate(block)` function
  - [ ] Event listeners
  - [ ] Data binding
  - [ ] API/content loading
  - [ ] Responsive behavior

- [ ] **CSS** (`{block}.css`)
  - [ ] All styles from React components
  - [ ] CSS variables for theming
  - [ ] Responsive breakpoints
  - [ ] Animation/transitions if needed

- [ ] **Documentation** (`README.md`)
  - [ ] Block purpose & usage
  - [ ] Authored fields explanation
  - [ ] Example content
  - [ ] Browser compatibility

---

## 🔄 Data & Content Migration

### Product Data
**Current**: Hardcoded in `App.tsx`
**Target**: AEM DAM + Product model reference
**Approach**:
1. Create `/models/_product.json` schema with nested variants model
2. Set up reference fields + nested repeatable items in Products block
3. Script to ingest current product data as AEM fragments
4. Editors can compose product lists with variant overrides
5. Fetch products dynamically at render time or via API

### Nested Model Composition
**Key Pattern**: Use `component` type fields with `multi: true` for repeatable structures:
```json
{
  "component": "component",
  "name": "items",
  "label": "Repeatable Items",
  "multi": true,
  "fields": [{ "extends": "nested-model-id" }]
}
```

### Configuration
**Current**: Theme variables in Tailwind config
**Target**: CSS custom properties
**Mapping**:
- `--dept-orange` (primary color)
- `--dept-gray-*` (grayscale)
- `--spacing-unit` (spacing scale)
- `--font-primary` (Inter Tight)

---

## 🛠 Technical Decisions

### Component Library Handling
- **Radix UI** - Not used in EDS (vanilla HTML elements instead)
- **Lucide React Icons** → Inline SVG or CSS
- **Emotion Styled** → Native CSS modules

### State Management
- **React State** → Data attributes + event listeners
- **Cart State** → localStorage or server session
- **Filters** → URL parameters + data attributes

### Styling Approach
- **Tailwind Compilation** → Inline CSS or CSS modules
- **Dynamic Theming** → CSS variables
- **Responsive** → CSS media queries

---

## 🎨 Design System Alignment

### Theme Integration
```css
/* From dept-kicks Tailwind Config */
--dept-orange: primary brand color
--dept-white: #ffffff
--dept-gray-50 through 900: grayscale
--dept-font: "Inter Tight", sans-serif
```

### Component Library
- Use semantic HTML (`<nav>`, `<article>`, `<section>`)
- ARIA attributes for accessibility
- Progressively enhanced (works without JS)

---

## 📝 Output Structure

**Final result:**
```
blocks/
├── hero/
│   ├── _hero.json
│   ├── hero.js
│   ├── hero.css
│   └── README.md
├── header/
│   ├── _header.json
│   ├── header.js
│   ├── header.css
│   └── README.md
├── products/
├── card/
├── footer/
└── cart/ (if needed as separate block)

models/
├── _product.json          (new)
├── _product-item.json     (if nested)
├── _cart-item.json        (new)

site-dna.json              (updated with new blocks)
component-definition.json  (auto-generated)
component-models.json      (auto-generated)
component-filters.json     (auto-generated)
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Hero + Header)
- [ ] Create hero & header block JSONs
- [ ] Convert React components to vanilla JS
- [ ] Write CSS from Tailwind
- [ ] Test in EDS environment

### Phase 2: Products & Cards (P0)
- [ ] Products listing block
- [ ] Product card item model
- [ ] Cart integration if needed
- [ ] Filter/search functionality

### Phase 3: Polish & Footer (P1)
- [ ] Footer block
- [ ] Cart sidebar block (optional)
- [ ] Cross-block interactions
- [ ] Performance optimization

### Phase 4: Testing & Documentation
- [ ] Browser compatibility testing
- [ ] AEM authoring workflow testing
- [ ] Content creation guide
- [ ] Component documentation

---

## 📚 Reference Links
- [EDS Blocks Pattern](../blocks/)
- [xwalk Documentation](https://github.com/adobe-rnd/xwalk)
- [Franklin/EDS Component Model](./models/)
- [Current Theme Config](./styles/theme.css)

---

## ✅ Success Criteria

1. ✅ All React components converted to EDS blocks
2. ✅ **Advanced nested models** allow editors to compose multi-level content (e.g., Headers with submenus, Products with variants)
3. ✅ **Repeatable item components** enable editors to add/remove items dynamically
4. ✅ Blocks are fully authorable in AEM via xwalk without code changes
5. ✅ Content editors can create complex pages through AEM UI alone
6. ✅ Visual parity with React version maintained
7. ✅ Responsive on all devices
8. ✅ No build step required for JS/CSS
9. ✅ Full documentation for each nested model
10. ✅ Sample authored content demonstrates all features including nested variants

---

## 🤔 Questions to Address During Conversion

1. **How should product data be managed?**
   - Single JSON endpoint?
   - AEM DAM references with nested variants?
   - Spreadsheet with auto-sync?

2. **Nested model depth - how deep should composition go?**
   - Hero → Stats only (1 level)
   - Products → Items → Variants (2 levels deep)
   - Support 3+ levels for future extensibility?

3. **Cart functionality scope?**
   - Page-level cart (no backend)?
   - Server-side cart with session persistence?
   - Third-party integration (Stripe, Shopify)?

4. **Search/Filter requirements?**
   - Client-side JavaScript filter?
   - Server-side search API?
   - Faceted navigation with category/price?

5. **Variant handling for products:**
   - Simple size/color arrays in editor interface?
   - Separate variant inventory management?
   - Matrix of size × color combinations?

---

## 📧 Next Steps

1. **Validate**: Review this prompt with stakeholders
2. **Refine**: Address ".🤔 Questions" above
3. **Prioritize**: Confirm Phase breakdown and timeline
4. **Kickoff**: Start with Phase 1 (Hero + Header)
5. **Iterate**: Build incrementally with testing between phases
