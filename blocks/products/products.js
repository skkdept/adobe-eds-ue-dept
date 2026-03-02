/**
 * Products Block
 * Displays a grid of products with filtering capabilities and variants
 */

// Sample product data - in production this would come from an API
const SAMPLE_PRODUCTS = [
  {
    id: '1',
    product_name: 'CloudRunner Pro',
    product_price: 159.99,
    product_category: 'Running',
    product_image: 'https://dks.scene7.com/is/image/dkscdn/25NIKMCROSMTCN10BLEBC_BLACK_WHITE_WORK_BLUE_is/?wid=252&hei=252&qlt=85,0&fmt=jpg&op_sharpen=1',
    product_description: 'Premium running sneakers with cloud-cushioning technology',
    is_featured: true,
    product_variants: [
      { variant_type: 'Size', variant_value: '8' },
      { variant_type: 'Size', variant_value: '9' },
      { variant_type: 'Size', variant_value: '10' },
    ],
  },
  {
    id: '2',
    product_name: 'Street Elite',
    product_price: 139.99,
    product_category: 'Lifestyle',
    product_image: 'https://dks.scene7.com/is/image/dkscdn/24ADIMDRPST3TRNRRJRD_Black_Ftwr_White_Red_is/?wid=252&hei=252&qlt=85,0&fmt=jpg&op_sharpen=1',
    product_description: 'Stylish lifestyle sneaker for everyday wear',
    is_featured: false,
    product_variants: [],
  },
  {
    id: '3',
    product_name: 'Velocity Max',
    product_price: 179.99,
    product_category: 'Running',
    product_image: 'https://dks.scene7.com/is/image/dkscdn/24NIKMFRMTCN6BLKWPRF_Cannon_Black_Light_Silver_is/?wid=252&hei=252&qlt=85,0&fmt=jpg&op_sharpen=1',
    product_description: 'Maximum speed and comfort for competitive runners',
    is_featured: true,
    product_variants: [],
  },
  {
    id: '4',
    product_name: 'Court Legend',
    product_price: 149.99,
    product_category: 'Basketball',
    product_image: 'https://dks.scene7.com/is/image/dkscdn/16NIKMRMNRCHVWHTNNNT_Black_Black_is/?wid=252&hei=252&qlt=85,0&fmt=jpg&op_sharpen=1',
    product_description: 'Classic basketball shoe for court domination',
    is_featured: false,
    product_variants: [],
  },
  {
    id: '5',
    product_name: 'Power Trainer X',
    product_price: 129.99,
    product_category: 'Training',
    product_image: 'https://dks.scene7.com/is/image/dkscdn/24MAZMCLDX4BLKCLXMNS_Ivory_Black_is/?wid=252&hei=252&qlt=85,0&fmt=jpg&op_sharpen=1',
    product_description: 'Durable training shoe for intense workouts',
    is_featured: false,
    product_variants: [],
  },
  {
    id: '6',
    product_name: 'Ultra Comfort',
    product_price: 119.99,
    product_category: 'Lifestyle',
    product_image: 'https://dks.scene7.com/is/image/dkscdn/25NIKMCROSMTCN10BLEBC_BLACK_WHITE_WORK_BLUE_is/?wid=252&hei=252&qlt=85,0&fmt=jpg&op_sharpen=1',
    product_description: 'Maximum comfort for all-day wear',
    is_featured: false,
    product_variants: [],
  },
];

/**
 * Decorates the products block
 * @param {HTMLElement} block - The products block element
 */
export async function decorate(block) {
  // Extract data from attributes
  const sectionTitle = block.dataset.sectionTitle || 'Featured Products';
  const sectionDescription = block.dataset.sectionDescription || '';
  const gridColumns = block.dataset.gridColumns || '4';

  // Parse products from data or use sample
  let products = SAMPLE_PRODUCTS;
  const productsData = block.dataset.productItems;
  if (productsData) {
    try {
      products = JSON.parse(productsData);
    } catch (e) {
      console.error('Invalid products JSON:', e);
    }
  }

  // Parse filters
  let filterCategories = [];
  const filtersData = block.dataset.categoryFilters;
  if (filtersData) {
    try {
      filterCategories = JSON.parse(filtersData);
    } catch (e) {
      console.error('Invalid filters JSON:', e);
    }
  } else {
    // Create default filters from products
    const categories = new Set(['All', ...products.map((p) => p.product_category)]);
    filterCategories = Array.from(categories).map((name) => ({
      filter_name: name,
      filter_id: name.toLowerCase(),
    }));
  }

  // Build HTML structure
  block.innerHTML = `
    <section id="products" class="products-section">
      <div class="products-wrapper">
        <!-- Header -->
        <div class="products-header">
          <h2 class="products-title">${sectionTitle}</h2>
          ${sectionDescription ? `<p class="products-description">${sectionDescription}</p>` : ''}
        </div>

        <!-- Filters -->
        ${
          filterCategories.length > 0
            ? `
          <div class="products-filters">
            ${filterCategories
              .map(
                (filter) =>
                  `<button class="products-filter-btn" data-filter="${filter.filter_id}">
                ${filter.filter_name}
              </button>`
              )
              .join('')}
          </div>
        `
            : ''
        }

        <!-- Grid -->
        <div class="products-grid" style="--grid-columns: ${gridColumns}">
          ${products
            .map(
              (product) => `
            <div class="product-card" data-category="${product.product_category.toLowerCase()}" data-product-id="${product.id}">
              <div class="product-image-container">
                <img src="${product.product_image}" alt="${product.product_name}" class="product-image" />
                <span class="product-category-badge">${product.product_category}</span>
                ${
                  product.is_featured
                    ? '<span class="product-featured-badge">Featured</span>'
                    : ''
                }
                <button class="product-add-to-cart">
                  🛒 Add to Cart
                </button>
              </div>
              <div class="product-info">
                <h3 class="product-name">${product.product_name}</h3>
                <p class="product-description">${product.product_description || ''}</p>
                <div class="product-price">\$${product.product_price.toFixed(2)}</div>
                ${
                  product.product_variants && product.product_variants.length > 0
                    ? `
                  <div class="product-variants">
                    ${product.product_variants
                      .map(
                        (v) =>
                          `<span class="product-variant-badge">${v.variant_value}</span>`
                      )
                      .join('')}
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  block.classList.add('products');

  // Filter functionality
  const filterButtons = block.querySelectorAll('.products-filter-btn');
  const productCards = block.querySelectorAll('.product-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active state
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter products
      const filterId = btn.dataset.filter;
      productCards.forEach((card) => {
        const category = card.dataset.category;
        if (filterId === 'all' || category === filterId) {
          card.style.display = '';
          card.classList.add('show');
        } else {
          card.style.display = 'none';
          card.classList.remove('show');
        }
      });
    });
  });

  // Set first filter as active
  if (filterButtons.length > 0) {
    filterButtons[0].classList.add('active');
  }

  // Add to cart functionality
  const addToCartButtons = block.querySelectorAll('.product-add-to-cart');
  addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      const productId = card.dataset.productId;
      const productName = card.querySelector('.product-name').textContent;
      const productPrice = card.querySelector('.product-price').textContent;

      // Get cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Add item to cart
      const existingItem = cart.find((item) => item.id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          quantity: 1,
        });
      }

      // Save and notify
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart } }));

      // Show feedback
      btn.textContent = '✓ Added!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '🛒 Add to Cart';
        btn.disabled = false;
      }, 2000);
    });
  });

  // Product card interaction
  const cards = block.querySelectorAll('.product-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover');
    });
  });
}

// Auto-initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.block.products').forEach(decorate);
  });
} else {
  document.querySelectorAll('.block.products').forEach(decorate);
}
