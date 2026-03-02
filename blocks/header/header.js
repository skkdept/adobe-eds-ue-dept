/**
 * Header Block
 * Displays a fixed header with logo, navigation categories, cart, and user account
 */

/**
 * Decorates the header block
 * @param {HTMLElement} block - The header block element
 */
export async function decorate(block) {
  // Extract data from attributes or nested elements
  const logoText = block.dataset.logoText || 'DEPT Kicks';
  const ctaButtonText = block.dataset.ctaButtonText || 'Shop Now';
  const ctaButtonHref = block.dataset.ctaButtonHref || '#products';
  const showSearch = block.dataset.showSearch !== 'false';
  const showCart = block.dataset.showCart !== 'false';
  const showUser = block.dataset.showUser !== 'false';

  // Parse navigation items from data or extract from DOM
  let navItems = [];
  const navData = block.dataset.navigationItems;
  if (navData) {
    try {
      navItems = JSON.parse(navData);
    } catch (e) {
      console.error('Invalid navigation items JSON:', e);
    }
  } else {
    // Extract from nested nav elements
    const navElements = block.querySelectorAll('[data-nav-label]');
    navElements.forEach((el) => {
      navItems.push({
        nav_label: el.dataset.navLabel,
        nav_href: el.dataset.navHref || '/',
        submenu_items: [],
      });
    });
  }

  // Default categories if none provided
  if (navItems.length === 0) {
    navItems = [
      { nav_label: 'All', nav_href: '/?category=all' },
      { nav_label: 'Running', nav_href: '/?category=running' },
      { nav_label: 'Basketball', nav_href: '/?category=basketball' },
      { nav_label: 'Training', nav_href: '/?category=training' },
      { nav_label: 'Lifestyle', nav_href: '/?category=lifestyle' },
    ];
  }

  // Build header HTML
  block.innerHTML = `
    <div class="header-wrapper">
      <div class="header-container">
        <!-- Logo -->
        <div class="header-logo">
          <h1>${logoText}</h1>
        </div>

        <!-- Desktop Navigation -->
        <nav class="header-nav-desktop">
          ${navItems.map((item) => `
            <a href="${item.nav_href || '/'}" class="header-nav-item">
              ${item.nav_label}
            </a>
          `).join('')}
        </nav>

        <!-- Mobile Menu Button -->
        <button class="header-menu-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Actions -->
        <div class="header-actions">
          ${showSearch ? '<button class="header-action-btn header-search-btn" aria-label="Search">🔍</button>' : ''}
          ${showCart ? `<button class="header-action-btn header-cart-btn" aria-label="Shopping cart">
            🛒
            <span class="header-cart-badge" style="display: none;">0</span>
          </button>` : ''}
          ${showUser ? '<button class="header-action-btn header-user-btn" aria-label="User account">👤</button>' : ''}
        </div>

        <!-- CTA Button -->
        <a href="${ctaButtonHref}" class="header-cta-button">${ctaButtonText}</a>
      </div>

      <!-- Mobile Menu -->
      <div class="header-mobile-menu" style="display: none;">
        <nav class="header-nav-mobile">
          ${navItems.map((item) => `
            <a href="${item.nav_href || '/'}" class="header-nav-item">${item.nav_label}</a>
          `).join('')}
        </nav>
      </div>

      <!-- Search Panel -->
      <div class="header-search-panel" style="display: none;">
        <input type="search" placeholder="Search products..." class="header-search-input" />
        <div class="header-search-results"></div>
      </div>

      <!-- User Menu -->
      <div class="header-user-menu" style="display: none;">
        <button class="header-user-signin">Sign In</button>
        <button class="header-user-signout" style="display: none;">Sign Out</button>
        <div class="header-user-info"></div>
      </div>
    </div>
  `;

  block.classList.add('header');

  // Handle scroll effect
  updateHeaderOnScroll();
  window.addEventListener('scroll', updateHeaderOnScroll);

  // Mobile menu toggle
  const menuToggle = block.querySelector('.header-menu-toggle');
  const mobileMenu = block.querySelector('.header-mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpen);
      mobileMenu.style.display = isOpen ? 'none' : 'block';
    });
  }

  // Navigation link handling
  const navLinks = block.querySelectorAll('.header-nav-item');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.href.startsWith('#') || link.href.includes('?')) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.location.href = href;
        }
      }
      // Close mobile menu after click
      if (mobileMenu && mobileMenu.style.display === 'block') {
        menuToggle.click();
      }
    });
  });

  // Cart button
  const cartBtn = block.querySelector('.header-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const cartEvent = new CustomEvent('cart-toggle', { bubbles: true, detail: { open: true } });
      document.dispatchEvent(cartEvent);
    });
  }

  // Search button
  const searchBtn = block.querySelector('.header-search-btn');
  const searchPanel = block.querySelector('.header-search-panel');
  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', () => {
      const isOpen = searchPanel.style.display === 'block';
      searchPanel.style.display = isOpen ? 'none' : 'block';
      if (!isOpen) {
        searchPanel.querySelector('.header-search-input').focus();
      }
    });

    // Search input
    const searchInput = searchPanel.querySelector('.header-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length > 2) {
          const searchEvent = new CustomEvent('product-search', {
            bubbles: true,
            detail: { query },
          });
          document.dispatchEvent(searchEvent);
        }
      });
    }
  }

  // User button
  const userBtn = block.querySelector('.header-user-btn');
  const userMenu = block.querySelector('.header-user-menu');
  const signInBtn = block.querySelector('.header-user-signin');
  const signOutBtn = block.querySelector('.header-user-signout');

  if (userBtn && userMenu) {
    userBtn.addEventListener('click', () => {
      const isOpen = userMenu.style.display === 'block';
      userMenu.style.display = isOpen ? 'none' : 'block';
    });
  }

  // Mock authentication
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      const user = {
        name: 'Guest User',
        email: 'guest@example.com',
      };
      localStorage.setItem('deptKicksUser', JSON.stringify(user));
      updateUserDisplay(block, user);
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      localStorage.removeItem('deptKicksUser');
      updateUserDisplay(block, null);
    });
  }

  // Check for existing user
  const savedUser = localStorage.getItem('deptKicksUser');
  if (savedUser) {
    try {
      updateUserDisplay(block, JSON.parse(savedUser));
    } catch (e) {
      console.error('Error loading user:', e);
    }
  }

  // Update cart count from localStorage
  updateCartCount(block);
  window.addEventListener('cart-updated', () => updateCartCount(block));
}

/**
 * Update header appearance based on scroll position
 */
function updateHeaderOnScroll() {
  const header = document.querySelector('.block.header');
  if (header) {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
}

/**
 * Update cart badge count
 */
function updateCartCount(block) {
  const badge = block.querySelector('.header-cart-badge');
  if (badge) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/**
 * Update user display in menu
 */
function updateUserDisplay(block, user) {
  const userMenu = block.querySelector('.header-user-menu');
  const signInBtn = block.querySelector('.header-user-signin');
  const signOutBtn = block.querySelector('.header-user-signout');
  const userInfo = block.querySelector('.header-user-info');

  if (user) {
    signInBtn.style.display = 'none';
    signOutBtn.style.display = 'block';
    if (userInfo) {
      userInfo.innerHTML = `<div class="header-user-name">${user.name}</div><div class="header-user-email">${user.email}</div>`;
    }
  } else {
    signInBtn.style.display = 'block';
    signOutBtn.style.display = 'none';
    if (userInfo) {
      userInfo.innerHTML = '';
    }
  }
}

// Auto-initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.block.header').forEach(decorate);
  });
} else {
  document.querySelectorAll('.block.header').forEach(decorate);
}

// Default export for backward compatibility
export default decorate;
