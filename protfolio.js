/**
 * MUHAMMED NASEEM T K - PORTFOLIO INTERACTIVITY & ANIMATIONS
 * Modern UI/UX Architecture with High-Performance JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initSkillsFilter();
  initProjectLightbox();
  initScrollToTop();
  initCopyEmail();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL EFFECT & SCROLLSPY
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  const sections = document.querySelectorAll('section[id], div.section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item a, .mobile-nav-links a');

  const onScroll = () => {
    // Add blurred/scrolled style when scrolled down
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Detection (Scrollspy)
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on initial load
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-drawer .btn');

  if (!mobileToggle || !mobileDrawer || !mobileOverlay) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
      document.body.style.overflow = '';
    }
  };

  mobileToggle.addEventListener('click', () => toggleMenu());
  mobileOverlay.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. TYPEWRITER ANIMATION (HERO SECTION)
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typewriterElem = document.getElementById('typewriter');
  if (!typewriterElem) return;

  const roles = [
    'Flutter Developer',
    'Cross-Platform Engineer',
    'Dart & Mobile Specialist',
    'Responsive UI Architect',
    'Unity & Interactive Creator'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add('revealed'));
    return;
  }

  // Set initial state
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      el.classList.add('revealed');
    } else {
      el.classList.add('reveal-init');
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px 60px 0px'
    }
  );

  reveals.forEach((el) => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   5. ANIMATED SKILL PROGRESS BARS
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  if (!skillBars.length) return;

  const triggerBars = () => {
    skillBars.forEach((bar) => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight - 20) {
        const targetWidth = bar.getAttribute('data-progress') || '85%';
        bar.style.width = targetWidth;
      }
    });
  };

  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-progress') || '85%';
          bar.style.width = targetWidth;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px 80px 0px' }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));
  triggerBars();
}

/* --------------------------------------------------------------------------
   6. SKILLS CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. PROJECT SCREENSHOT LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initProjectLightbox() {
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || !modalImg) return;

  const openLightbox = (imgSrc, title, desc) => {
    modalImg.src = imgSrc;
    modalImg.alt = title || 'Project Screenshot';
    if (modalTitle) modalTitle.textContent = title || '';
    if (modalDesc) modalDesc.textContent = desc || '';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-image') || trigger.querySelector('img')?.src;
      const title = trigger.getAttribute('data-title');
      const desc = trigger.getAttribute('data-desc');
      if (imgSrc) openLightbox(imgSrc, title, desc);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   8. SCROLL TO TOP & CIRCULAR PROGRESS
   -------------------------------------------------------------------------- */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const progressCircle = document.querySelector('.scroll-progress-circle circle');

  if (!scrollTopBtn) return;

  const totalDash = 157; // 2 * PI * r (approx 2 * 3.14159 * 25)

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Show button past 300px
    if (scrollPos > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Update circular progress meter
    if (progressCircle && scrollHeight > 0) {
      const progress = scrollPos / scrollHeight;
      const dashOffset = totalDash - progress * totalDash;
      progressCircle.style.strokeDashoffset = Math.max(0, dashOffset);
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   9. ONE-CLICK EMAIL COPY WITH TOOLTIP FEEDBACK
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'muhammednaseemtk000@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      copyBtn.style.color = '#34d399';
      copyBtn.style.borderColor = '#34d399';

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 2500);
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  });
}

/* --------------------------------------------------------------------------
   10. EMAILJS CONTACT FORM SUBMISSION (PRESERVES EXISTING WORKING FUNCTIONALITY)
   -------------------------------------------------------------------------- */
function sendEmail(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const statusDiv = document.getElementById('form-status');

  if (!nameInput || !emailInput || !messageInput || !submitBtn) return;

  const nameVal = nameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const subjectVal = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
  const messageVal = messageInput.value.trim();

  // Basic Validation
  if (!nameVal || !emailVal || !messageVal) {
    showFormStatus('error', 'Please fill in all required fields.');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailVal)) {
    showFormStatus('error', 'Please provide a valid email address.');
    return;
  }

  // Params preserved for EmailJS template
  const params = {
    name: nameVal,
    email: emailVal,
    subject: subjectVal,
    message: messageVal
  };

  // User's specific EmailJS credentials
  const serviceID = 'service_wqyaxs2';
  const templateID = 'template_tf6dimq';

  // Set loading state
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  hideFormStatus();

  emailjs.send(serviceID, templateID, params)
    .then((res) => {
      console.log('EmailJS Success:', res);
      nameInput.value = '';
      emailInput.value = '';
      if (subjectInput) subjectInput.value = '';
      messageInput.value = '';

      showFormStatus('success', 'Thank you, Naseem received your message! He will get back to you promptly.');
    })
    .catch((err) => {
      console.error('EmailJS Error:', err);
      showFormStatus('error', 'Something went wrong while sending your message. Please email directly at muhammednaseemtk000@gmail.com.');
    })
    .finally(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    });
}

function showFormStatus(type, message) {
  const statusDiv = document.getElementById('form-status');
  if (!statusDiv) return;

  statusDiv.className = `form-status ${type}`;
  const icon = type === 'success' 
    ? '<i class="fa-solid fa-circle-check"></i>' 
    : '<i class="fa-solid fa-circle-exclamation"></i>';

  statusDiv.innerHTML = `${icon} <span>${message}</span>`;
  statusDiv.style.display = 'flex';
}

function hideFormStatus() {
  const statusDiv = document.getElementById('form-status');
  if (!statusDiv) return;
  statusDiv.style.display = 'none';
}
