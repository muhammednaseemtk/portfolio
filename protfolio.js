/**
 * MUHAMMED NASEEM T K - PORTFOLIO INTERACTIVITY & ANIMATIONS
 * Modern UI/UX Architecture with High-Performance JavaScript
 * Inspired by ebuka.marketing + partner.clleancode.com
 */

let lenisInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScrolling();
  initReadingProgressBar();
  initHeroReveal();
  initHeroParallax();
  initNavbarScroll();
  initCleanAnchorLinks();
  initMobileMenu();
  initTypewriter();
  initScrollReveal();
  initStatCounters();
  initSkillBars();
  initSkillsReveal();
  initSkillsFilter();
  initProjectScrollEffects();
  initProjectLightbox();
  initTimelineProgress();
  initContactReveal();
  initScrollToTop();
  initCopyEmail();
});

/* --------------------------------------------------------------------------
   0. SMOOTH SCROLLING ENGINE (LENIS MOMENTUM & NATIVE FALLBACK)
   -------------------------------------------------------------------------- */
function initSmoothScrolling() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || typeof Lenis === 'undefined') {
    return;
  }

  try {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false
    });

    function raf(time) {
      if (lenisInstance) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
    }
    requestAnimationFrame(raf);

    // Sync scroll listeners with Lenis
    lenisInstance.on('scroll', () => {
      updateScrollReadingProgress();
      updateTimelineFill();
    });
  } catch (err) {
    console.warn('Smooth scroll fallback:', err);
  }
}

/* --------------------------------------------------------------------------
   0.1 GLOBAL READING PROGRESS BAR (FIXED LUXURY GOLD LINE)
   -------------------------------------------------------------------------- */
function updateScrollReadingProgress() {
  const progressBar = document.getElementById('scroll-reading-progress');
  if (!progressBar) return;

  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

  progressBar.style.transform = `scaleX(${progress})`;
}

function initReadingProgressBar() {
  window.addEventListener('scroll', updateScrollReadingProgress, { passive: true });
  updateScrollReadingProgress();
}

/* --------------------------------------------------------------------------
   0.2 HERO OPENING CHOREOGRAPHY & PARALLAX
   -------------------------------------------------------------------------- */
function initHeroReveal() {
  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  requestAnimationFrame(() => {
    heroSection.classList.add('hero-revealed');
  });
}

function initHeroParallax() {
  const avatar = document.querySelector('.avatar-container');
  const heroSection = document.getElementById('home');
  if (!avatar || !heroSection) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY < window.innerHeight) {
      avatar.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   0.3 DYNAMIC STAT COUNTERS (ABOUT SECTION)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statBox = document.querySelector('.about-highlights-grid');
  if (!statBox) return;

  let animated = false;

  const animateStats = () => {
    if (animated) return;
    animated = true;

    const counterElements = statBox.querySelectorAll('.counter-val');
    counterElements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target')) || 0;
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        el.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(statBox);
}

/* --------------------------------------------------------------------------
   0.4 EXPERIENCE TIMELINE DYNAMIC LINE FILL & MARKER PULSE
   -------------------------------------------------------------------------- */
function updateTimelineFill() {
  const experienceSection = document.getElementById('experience');
  const timelineFill = document.getElementById('timeline-line-fill');
  const timelineContainer = document.querySelector('.timeline-container');
  if (!experienceSection || !timelineFill || !timelineContainer) return;

  const rect = timelineContainer.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const start = windowHeight * 0.75;
  const totalHeight = rect.height;
  const currentPos = start - rect.top;

  let progress = 0;
  if (currentPos > 0) {
    progress = Math.min(1, Math.max(0, currentPos / totalHeight));
  }

  timelineFill.style.height = `${(progress * 100).toFixed(1)}%`;

  const items = timelineContainer.querySelectorAll('.timeline-item');
  items.forEach((item) => {
    const node = item.querySelector('.timeline-node');
    if (!node) return;
    const nodeRect = node.getBoundingClientRect();
    if (nodeRect.top <= start + 40) {
      node.classList.add('active-node');
    } else {
      node.classList.remove('active-node');
    }
  });
}

function initTimelineProgress() {
  window.addEventListener('scroll', updateTimelineFill, { passive: true });
  updateTimelineFill();
}

/* --------------------------------------------------------------------------
   0.5 PROJECTS SCROLL REVEALS & IMAGE MASKS
   -------------------------------------------------------------------------- */
function initProjectScrollEffects() {
  const projectCards = document.querySelectorAll('.project-card');
  if (!projectCards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px 60px 0px' });

  projectCards.forEach((card) => observer.observe(card));
}

/* --------------------------------------------------------------------------
   0.6 CONTACT SECTION CASCADE REVEAL
   -------------------------------------------------------------------------- */
function initContactReveal() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        contactSection.classList.add('contact-revealed');
        contactSection.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
        obs.unobserve(contactSection);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px 80px 0px' });

  observer.observe(contactSection);
}

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL EFFECT & SCROLLSPY
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item a, .mobile-nav-links a');

  const setActiveNav = (id) => {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const onScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Add blurred/scrolled styling when scrolled past threshold
      if (navbar) {
        if (scrollY > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Edge Case 1: At the top of the page
      if (scrollY < 100) {
        setActiveNav('home');
        return;
      }

        // Edge Case 2: Near the bottom of the page
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (scrollY + windowHeight >= documentHeight - 60) {
          setActiveNav('contact');
          return;
        }

        // General Section Detection using getBoundingClientRect
        const navbarHeight = navbar ? navbar.offsetHeight : 72;
        const triggerPoint = navbarHeight + 50;
        let currentId = 'home';

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= triggerPoint && (rect.top + rect.height) > triggerPoint) {
            currentId = section.getAttribute('id');
          }
        });

        setActiveNav(currentId);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // Run on initial load
    }

  /* --------------------------------------------------------------------------
     2. CLEAN ANCHOR NAVIGATION (REMOVES #HASHTAG FROM URL ON SCROLL/CLICK)
     -------------------------------------------------------------------------- */
  function initCleanAnchorLinks() {
    const navbar = document.querySelector('.navbar-custom');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileOverlay = document.getElementById('mobile-drawer-overlay');
    const mobileToggle = document.getElementById('mobile-toggle');

  const closeMobileMenu = () => {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      mobileDrawer.classList.remove('open');
      if (mobileOverlay) mobileOverlay.classList.remove('active');
      if (mobileToggle) mobileToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
      document.body.style.overflow = '';
    }
  };

    const getTrueElementTop = (el) => {
      let top = 0;
      let curr = el;
      while (curr) {
        top += curr.offsetTop;
        curr = curr.offsetParent;
      }
      return top;
    };

    const getSectionTargetPos = (sectionEl) => {
      const sectionHeader = sectionEl.querySelector('.section-header') || sectionEl;
      const headerTop = getTrueElementTop(sectionHeader);
      // Sticky navbar is 72px when scrolled. Provide an optimal, balanced 28px clearance below it.
      const navbarScrolledHeight = 72;
      const clearance = 28;
      return Math.max(0, headerTop - navbarScrolledHeight - clearance);
    };

          // If page was opened with a hash in URL (e.g. /#about), scroll to section and clear the hash
          if (window.location.hash) {
            const initialTarget = document.querySelector(window.location.hash);
            if (initialTarget) {
              setTimeout(() => {
                const targetPos = window.location.hash === '#home'
                  ? 0
                  : getSectionTargetPos(initialTarget);

                window.scrollTo({
                  top: targetPos,
                  behavior: 'smooth'
                });

            if (window.history && window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }, 100);
      }
    }

        // Intercept all internal anchor clicks to navigate smoothly without changing URL hash
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach((link) => {
          link.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            if (!hash || hash === '#') return;

              const target = document.querySelector(hash);
              if (target) {
                e.preventDefault();

                // Close mobile drawer if open
                closeMobileMenu();

                const targetPos = hash === '#home'
                  ? 0
                  : getSectionTargetPos(target);

                if (lenisInstance) {
                  lenisInstance.scrollTo(targetPos, { duration: 1.15 });
                } else {
                  window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                  });
                }

                if (target) {
                  target.classList.add('revealed');
                  target.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
                  if (hash === '#skills') target.classList.add('skills-revealed');
                  if (hash === '#contact') target.classList.add('contact-revealed');
                }

                // Strip hashtag from address bar
                  if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                  }

                  // Set active class on clicked link immediately
                  const navLinks = document.querySelectorAll('.nav-link-item a, .mobile-nav-links a');
                  navLinks.forEach((l) => {
                    if (l.getAttribute('href') === hash) {
                      l.classList.add('active');
                    } else {
                      l.classList.remove('active');
                    }
        });
      }
    });
});
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
      threshold: 0.04,
      rootMargin: '0px 0px 120px 0px'
    }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // Fast scroll fallback: reveal any element when scrolled past
  window.addEventListener('scroll', () => {
    reveals.forEach((el) => {
      if (!el.classList.contains('revealed')) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 20) {
          el.classList.add('revealed');
        }
      }
    });
  }, { passive: true });
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
   5.1 SKILLS SECTION SCROLL REVEAL & PROGRESSIVE ANIMATION
   -------------------------------------------------------------------------- */
function initSkillsReveal() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    skillsSection.classList.add('skills-revealed');
    return;
  }

  // Check if skills is already within or near viewport on load
  const rect = skillsSection.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  if (rect.top < windowHeight - 40) {
    skillsSection.classList.add('skills-revealed');
    skillsSection.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
    return;
  }

  // Set initial hidden state for animated reveal
  skillsSection.classList.add('skills-init');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillsSection.classList.add('skills-revealed');
          skillsSection.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
          // Stop observing so animations never restart when scrolling up and down
          obs.unobserve(skillsSection);
        }
      });
    },
    {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px 80px 0px' // triggers 80px before entering viewport for smooth entrance
    }
  );

  observer.observe(skillsSection);

  // Safety fallback: ensure cards are never permanently invisible if user scrolls past fast
  window.addEventListener('scroll', function onScrollCheck() {
    const r = skillsSection.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      skillsSection.classList.add('skills-revealed');
      skillsSection.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
      window.removeEventListener('scroll', onScrollCheck);
    }
  }, { passive: true });
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

      // Clear any entrance stagger delays so filtering is instantaneous and crisp
      skillCards.forEach((card) => {
        card.style.transitionDelay = '0s';
        card.querySelectorAll('.skill-box-item').forEach((item) => {
          item.style.transitionDelay = '0s';
        });

        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          // Force layout reflow before triggering opacity/transform
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px) scale(0.97)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 220);
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
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

/* --------------------------------------------------------------------------
   9. ONE-CLICK EMAIL COPY WITH TOOLTIP FEEDBACK
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const showCopiedFeedback = () => {
    const originalHtml = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    copyBtn.classList.add('copied');

    setTimeout(() => {
      copyBtn.innerHTML = originalHtml;
      copyBtn.classList.remove('copied');
    }, 2400);
  };

  copyBtn.addEventListener('click', () => {
    const email = 'muhammednaseemtk000@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showCopiedFeedback).catch(() => {
        fallbackCopyText(email);
        showCopiedFeedback();
      });
    } else {
      fallbackCopyText(email);
      showCopiedFeedback();
    }
  });
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (err) {}
  document.body.removeChild(textarea);
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
