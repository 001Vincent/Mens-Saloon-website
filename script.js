/* ===================================================
   HAIR BLENDER - JavaScript
   =================================================== */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

// ===== HAMBURGER MENU =====
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when clicking a link
document.querySelectorAll('.nav-link, .nav-book-btn').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
    if (document.getElementById('lightbox').classList.contains('open')) {
      closeLightbox();
    }
  }
});

// ===== ACTIVE NAV LINK =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== HERO BG PARALLAX =====
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  heroBg.classList.add('loaded');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

// ===== SLIDESHOW =====
const slides = document.querySelectorAll('.slide');
const slideshowDotsContainer = document.getElementById('slideDots');
let currentSlide = 0;
let slideshowInterval;

function createDots() {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    slideshowDotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  document.querySelectorAll('.dot')[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }
function startSlideshow() { slideshowInterval = setInterval(nextSlide, 4500); }
function stopSlideshow() { clearInterval(slideshowInterval); }

if (slides.length > 0) {
  createDots();
  startSlideshow();

  document.getElementById('slideNext').addEventListener('click', () => {
    stopSlideshow(); nextSlide(); startSlideshow();
  });
  document.getElementById('slidePrev').addEventListener('click', () => {
    stopSlideshow(); prevSlide(); startSlideshow();
  });

  // Touch swipe support
  let touchStartX = 0;
  const slideshowWrapper = document.querySelector('.slideshow-wrapper');
  if (slideshowWrapper) {
    slideshowWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    slideshowWrapper.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        stopSlideshow();
        diff > 0 ? nextSlide() : prevSlide();
        startSlideshow();
      }
    }, { passive: true });
  }
}

// ===== GALLERY FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (filter === 'all' || item.classList.contains(filter)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== LIGHTBOX =====
const galleryImages = [
  { src: 'gallery_1.jpg', caption: 'Clean Fade' },
  { src: 'gallery_2.jpg', caption: 'Taper Fade' },
  { src: 'gallery_3.jpg', caption: 'Skin Fade + Waves' },
  { src: 'gallery_4.jpg', caption: 'Beard Sculpt' },
  { src: 'gallery_5.jpg', caption: 'High Top Fade' },
  { src: 'gallery_6.jpg', caption: 'Caesar Cut' },
  { src: 'gallery_7.jpg', caption: 'Curly Top Fade' },
  { src: 'gallery_8.jpg', caption: 'Shape-Up' },
];

let currentLightboxIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(index) {
  currentLightboxIndex = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxCaption.textContent = galleryImages[index].caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

function lightboxNav(direction) {
  currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
  lightboxImg.src = '';
  setTimeout(() => {
    lightboxImg.src = galleryImages[currentLightboxIndex].src;
    lightboxCaption.textContent = galleryImages[currentLightboxIndex].caption;
  }, 100);
}

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
});

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.lightboxNav = lightboxNav;

// ===== BOOKING FORM WITH WHATSAPP REDIRECT =====
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  // Set minimum date to today
  const dateInput = document.getElementById('prefDate');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Live validation helper
  function validateField(input, errorId) {
    const group = input.closest('.form-group');
    const val = input.value.trim();
    const isValid = val !== '' && val !== undefined;

    if (!isValid) {
      group.classList.add('has-error');
      input.classList.add('error');
      input.classList.remove('valid');
    } else {
      group.classList.remove('has-error');
      input.classList.remove('error');
      input.classList.add('valid');
    }
    return isValid;
  }

  // Attach live validation on blur
  ['fullName', 'phoneNumber', 'prefDate', 'prefTime', 'chooseService'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateField(el, `err-${id}`));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validateField(el, `err-${id}`);
      });
    }
  });

  // Format date nicely for WhatsApp message
  function formatDate(dateStr) {
    if (!dateStr) return 'Not specified';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Build WhatsApp message from form data
  function buildWhatsAppMessage(data) {
    const msg = [
      '✂️ *NEW APPOINTMENT REQUEST* ✂️',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      `👤 *Full Name:* ${data.fullName}`,
      `📱 *Phone:* ${data.phone}`,
      `📅 *Date:* ${formatDate(data.date)}`,
      `🕐 *Time:* ${data.time}`,
      `✂️ *Service:* ${data.service}`,
      '',
      data.notes
        ? `📝 *Notes:* ${data.notes}`
        : '📝 *Notes:* No additional notes',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Sent via Hair Blender website 🌐',
    ].join('\n');
    return encodeURIComponent(msg);
  }

  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all required fields
    const fields = [
      { id: 'fullName', errId: 'err-name' },
      { id: 'phoneNumber', errId: 'err-phone' },
      { id: 'prefDate', errId: 'err-date' },
      { id: 'prefTime', errId: 'err-time' },
      { id: 'chooseService', errId: 'err-service' },
    ];

    let allValid = true;
    fields.forEach(f => {
      const input = document.getElementById(f.id);
      if (!validateField(input, f.errId)) {
        allValid = false;
      }
    });

    if (!allValid) {
      // Scroll to first error
      const firstError = bookingForm.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Collect values
    const data = {
      fullName: document.getElementById('fullName').value.trim(),
      phone: document.getElementById('phoneNumber').value.trim(),
      date: document.getElementById('prefDate').value,
      time: document.getElementById('prefTime').value,
      service: document.getElementById('chooseService').value,
      notes: document.getElementById('additionalNotes').value.trim(),
    };

    // Build URL and open WhatsApp
    const waNumber = '2349061162976';
    const message = buildWhatsAppMessage(data);
    const waUrl = `https://wa.me/${waNumber}?text=${message}`;

    // Show a brief success flash before opening WhatsApp
    const submitBtn = document.getElementById('booking-submit-btn');
    const originalHtml = submitBtn.innerHTML;

    submitBtn.innerHTML = `<span style="position:relative;z-index:1">&#10003; Opening WhatsApp...</span>`;
    submitBtn.disabled = true;
    submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';

    setTimeout(() => {
      window.open(waUrl, '_blank');

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        bookingForm.reset();
        // Remove valid classes
        bookingForm.querySelectorAll('.form-input').forEach(inp => {
          inp.classList.remove('valid', 'error');
        });
      }, 3000);
    }, 600);
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function addReveal() {
  const elementsToReveal = [
    '.service-card',
    '.gallery-item',
    '.testimonial-card',
    '.about-content',
    '.about-visual',
    '.stat-item',
    '.feature-item',
    '.booking-form-wrapper',
    '.social-quick-btn',
  ];
  elementsToReveal.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i === 1) el.classList.add('reveal-delay-1');
      if (i === 2) el.classList.add('reveal-delay-2');
      if (i === 3) el.classList.add('reveal-delay-3');
      revealObserver.observe(el);
    });
  });
}

addReveal();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const text = counter.textContent;
    const num = parseInt(text);
    if (isNaN(num)) return;
    const suffix = text.replace(/[0-9]/g, '');
    let start = 0;
    const duration = 2000;
    const step = (num / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        counter.textContent = num + suffix;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(start) + suffix;
      }
    }, 16);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ===== FLOATING BUTTONS VISIBILITY =====
const floatingBtns = document.getElementById('floatingBtns');
floatingBtns.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
floatingBtns.style.opacity = '0';
floatingBtns.style.transform = 'translateY(20px)';

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    floatingBtns.style.opacity = '1';
    floatingBtns.style.transform = 'translateY(0)';
  } else {
    floatingBtns.style.opacity = '0';
    floatingBtns.style.transform = 'translateY(20px)';
  }
}, { passive: true });

// ===== PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});
