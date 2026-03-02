/**
 * Footer Block
 * Displays footer with sections, links, and social media
 */

/**
 * Decorates the footer block
 * @param {HTMLElement} block - The footer block element
 */
export async function decorate(block) {
  // Extract data from attributes
  const copyrightText = block.dataset.copyrightText || '© 2026 DEPT Kicks. All rights reserved.';
  const newsletterEnabled = block.dataset.newsletterEnabled !== 'false';
  const newsletterPlaceholder = block.dataset.newsletterPlaceholder || 'Enter your email';

  // Parse footer sections
  let footerSections = [];
  const sectionsData = block.dataset.footerSections;
  if (sectionsData) {
    try {
      footerSections = JSON.parse(sectionsData);
    } catch (e) {
      console.error('Invalid footer sections JSON:', e);
    }
  }

  // Default sections if not provided
  if (footerSections.length === 0) {
    footerSections = [
      {
        section_title: 'Shop',
        section_links: [
          { link_text: 'New Arrivals', link_href: '/?category=new' },
          { link_text: 'Running', link_href: '/?category=running' },
          { link_text: 'Basketball', link_href: '/?category=basketball' },
          { link_text: 'Training', link_href: '/?category=training' },
          { link_text: 'Lifestyle', link_href: '/?category=lifestyle' },
        ],
      },
      {
        section_title: 'Company',
        section_links: [
          { link_text: 'About Us', link_href: '/about' },
          { link_text: 'Careers', link_href: '/careers' },
          { link_text: 'Press', link_href: '/press' },
          { link_text: 'Blog', link_href: '/blog' },
        ],
      },
      {
        section_title: 'Support',
        section_links: [
          { link_text: 'Contact', link_href: '/contact' },
          { link_text: 'FAQ', link_href: '/faq' },
          { link_text: 'Shipping Info', link_href: '/shipping' },
          { link_text: 'Returns', link_href: '/returns' },
        ],
      },
      {
        section_title: 'Legal',
        section_links: [
          { link_text: 'Privacy Policy', link_href: '/privacy' },
          { link_text: 'Terms of Service', link_href: '/terms' },
          { link_text: 'Cookie Policy', link_href: '/cookies' },
        ],
      },
    ];
  }

  // Parse social links
  let socialLinks = [];
  const socialData = block.dataset.socialMedia;
  if (socialData) {
    try {
      socialLinks = JSON.parse(socialData);
    } catch (e) {
      console.error('Invalid social links JSON:', e);
    }
  }

  // Default social links if not provided
  if (socialLinks.length === 0) {
    socialLinks = [
      { platform: 'Twitter', social_url: 'https://twitter.com' },
      { platform: 'Instagram', social_url: 'https://instagram.com' },
      { platform: 'Facebook', social_url: 'https://facebook.com' },
      { platform: 'LinkedIn', social_url: 'https://linkedin.com' },
    ];
  }

  // Build footer HTML
  block.innerHTML = `
    <footer class="footer-wrapper">
      <div class="footer-container">
        <!-- Newsletter -->
        ${
          newsletterEnabled
            ? `
          <div class="footer-newsletter">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for exclusive deals and updates</p>
            <form class="footer-newsletter-form" name="newsletter">
              <input 
                type="email" 
                placeholder="${newsletterPlaceholder}" 
                required 
                class="footer-newsletter-input"
                aria-label="Email address"
              />
              <button type="submit" class="footer-newsletter-btn">Subscribe</button>
            </form>
            <div class="footer-newsletter-message"></div>
          </div>
        `
            : ''
        }

        <!-- Link Sections -->
        <div class="footer-sections-container">
          ${footerSections
            .map(
              (section) => `
            <div class="footer-section">
              <h4>${section.section_title}</h4>
              <ul class="footer-links">
                ${section.section_links
                  .map(
                    (link) =>
                      `<li><a href="${link.link_href}">${link.link_text}</a></li>`
                  )
                  .join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Social Links -->
        ${
          socialLinks.length > 0
            ? `
          <div class="footer-social">
            <h4>Follow Us</h4>
            <div class="footer-social-links">
              ${socialLinks
                .map(
                  (link) => `
                <a href="${link.social_url}" target="_blank" rel="noopener noreferrer" aria-label="${link.platform}">
                  ${getPlatformIcon(link.platform)}
                </a>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <p>${copyrightText}</p>
        <div class="footer-bottom-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  `;

  block.classList.add('footer');

  // Newsletter form handling
  const form = block.querySelector('.footer-newsletter-form');
  if (form) {
    form.addEventListener('submit', handleNewsletterSubmit);
  }

  // Social link tracking
  const socialLinksElements = block.querySelectorAll('.footer-social-links a');
  socialLinksElements.forEach((link) => {
    link.addEventListener('click', (e) => {
      const platform = link.getAttribute('aria-label');
      console.log(`Social link clicked: ${platform}`);
      // Track with analytics if available
      if (window.gtag) {
        window.gtag('event', 'social_click', { platform });
      }
    });
  });
}

/**
 * Get platform icon SVG
 * @param {string} platform - Social media platform name
 */
function getPlatformIcon(platform) {
  const icons = {
    'Twitter / X': '𝕏',
    Twitter: '𝑿',
    Instagram: '📷',
    Facebook: 'f',
    LinkedIn: 'in',
    YouTube: '▶',
  };
  return icons[platform] || '●';
}

/**
 * Handle newsletter form submission
 */
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('.footer-newsletter-input');
  const btn = form.querySelector('.footer-newsletter-btn');
  const message = form.querySelector('.footer-newsletter-message');

  const email = input.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message.textContent = 'Please enter a valid email';
    message.className = 'footer-newsletter-message error';
    return;
  }

  // Simulate API call
  btn.disabled = true;
  btn.textContent = 'Subscribing...';

  setTimeout(() => {
    // Save to localStorage (in production, send to backend)
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }

    message.textContent = 'Thanks for subscribing! 🎉';
    message.className = 'footer-newsletter-message success';
    input.value = '';
    btn.disabled = false;
    btn.textContent = 'Subscribe';

    // Reset message after 3 seconds
    setTimeout(() => {
      message.textContent = '';
      message.className = 'footer-newsletter-message';
    }, 3000);
  }, 800);
}

// Auto-initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.block.footer').forEach(decorate);
  });
} else {
  document.querySelectorAll('.block.footer').forEach(decorate);
}

// Default export for backward compatibility
export default decorate;
