/**
 * Hero Block
 * Displays a full-height hero section with heading, description, CTA, image, and statistics
 */

/**
 * Creates structured HTML for hero block from authored content
 * @param {HTMLElement} block - The hero block element
 */
export async function decorate(block) {
  // Extract data attributes from block
  const seasonLabel = block.dataset.seasonLabel || 'New Season Drop — 2026';
  const heading = block.dataset.heading || 'Step into performance';
  const description = block.dataset.description || 'Curated footwear from the world\'s top athletic brands';
  const ctaText = block.dataset.ctaText || 'Shop Collection';
  const ctaLink = block.dataset.ctaLink || '#products';
  const imageUrl = block.dataset.imageUrl || 'https://images.unsplash.com/photo-1768647417374-5a31c61dc5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBhdGhsZXRpYyUyMHBlcmZvcm1hbmNlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzIxNzQ5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080';

  // Parse stats from data attribute or extract from nested elements
  let stats = [];
  const statsData = block.dataset.stats;
  if (statsData) {
    try {
      stats = JSON.parse(statsData);
    } catch (e) {
      console.error('Invalid stats JSON:', e);
      // Fallback stats
      stats = [
        { stat_value: '24', stat_label: 'Styles' },
        { stat_value: '6', stat_label: 'Brands' },
        { stat_value: '4', stat_label: 'Categories' },
        { stat_value: 'Free', stat_label: 'Shipping $75+' },
      ];
    }
  } else {
    // Extract from nested stat elements if data attribute not present
    const statElements = block.querySelectorAll('[data-stat-value]');
    statElements.forEach((el) => {
      stats.push({
        stat_value: el.dataset.statValue,
        stat_label: el.dataset.statLabel,
      });
    });
  }

  // If no stats found, use defaults
  if (stats.length === 0) {
    stats = [
      { stat_value: '24', stat_label: 'Styles' },
      { stat_value: '6', stat_label: 'Brands' },
      { stat_value: '4', stat_label: 'Categories' },
      { stat_value: 'Free', stat_label: 'Shipping $75+' },
    ];
  }

  // Build the hero HTML structure
  block.innerHTML = `
    <section class="hero-section">
      <!-- Desktop: Two-column layout -->
      <div class="hero-desktop">
        <!-- Text Column -->
        <div class="hero-text">
          <p class="hero-season">${seasonLabel}</p>
          <h1 class="hero-heading">${heading}</h1>
          <p class="hero-description">${description}</p>
          <div class="hero-cta-group">
            <button class="hero-cta-primary" data-link="${ctaLink}">${ctaText}</button>
            <button class="hero-cta-secondary">
              <span class="hero-scroll-icon">↓</span>
              Scroll Down
            </button>
          </div>
        </div>

        <!-- Image Column -->
        <div class="hero-image-container">
          <div class="hero-image-wrapper">
            <img src="${imageUrl}" alt="Hero" class="hero-image" />
          </div>
          
          <!-- Stats Bar -->
          <div class="hero-stats-bar">
            <div class="hero-stats-grid">
              ${stats.map((stat) => `
                <div class="hero-stat-item">
                  <div class="hero-stat-value">${stat.stat_value}</div>
                  <div class="hero-stat-label">${stat.stat_label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Tablet: Compact layout -->
      <div class="hero-tablet">
        <div class="hero-tablet-header">
          <p class="hero-season">${seasonLabel}</p>
          <h1 class="hero-heading">${heading}</h1>
        </div>

        <div class="hero-tablet-content">
          <div class="hero-tablet-text">
            <p class="hero-description">${description}</p>
            <button class="hero-cta-primary" data-link="${ctaLink}">${ctaText}</button>
          </div>

          <div class="hero-tablet-stats">
            ${stats.slice(0, 4).map((stat) => `
              <div class="hero-stat-card">
                <div class="hero-stat-value">${stat.stat_value}</div>
                <div class="hero-stat-label">${stat.stat_label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="hero-tablet-image">
          <img src="${imageUrl}" alt="Hero" class="hero-image" />
        </div>
      </div>

      <!-- Mobile: Single column -->
      <div class="hero-mobile">
        <p class="hero-season">${seasonLabel}</p>
        <h1 class="hero-heading">${heading}</h1>
        <p class="hero-description">${description}</p>
        <button class="hero-cta-primary" data-link="${ctaLink}">${ctaText}</button>
        
        <div class="hero-mobile-stats">
          ${stats.map((stat) => `
            <div class="hero-stat-item">
              <div class="hero-stat-value">${stat.stat_value}</div>
              <div class="hero-stat-label">${stat.stat_label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  block.classList.add('hero');

  // Add event listeners
  const primaryCta = block.querySelector('.hero-cta-primary');
  if (primaryCta) {
    primaryCta.addEventListener('click', (e) => {
      const link = primaryCta.dataset.link;
      if (link) {
        if (link.startsWith('#')) {
          const target = document.querySelector(link);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.location.href = link;
        }
      }
    });
  }

  const secondaryCta = block.querySelector('.hero-cta-secondary');
  if (secondaryCta) {
    secondaryCta.addEventListener('click', () => {
      const productsSection = document.querySelector('#products') || 
                             document.querySelector('[class*="products"]') ||
                             block.nextElementSibling;
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Scroll effect for header
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    block.dataset.scrolled = lastScroll > 50 ? 'true' : 'false';
  });
}

// Auto-initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.block.hero').forEach(decorate);
  });
} else {
  document.querySelectorAll('.block.hero').forEach(decorate);
}
