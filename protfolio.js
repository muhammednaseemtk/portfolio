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
  initSkillsMarquee();
  initProjectScrollEffects();
  initProjectLightbox();
  initMoviesNestGallery();
  initTimelineProgress();
  initContactReveal();
  initCopyEmail();
});

/* --------------------------------------------------------------------------
   0. SMOOTH SCROLLING ENGINE (LENIS MOMENTUM & GSAP SYNCHRONIZATION)
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

    // Synchronize Lenis with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        if (lenisInstance) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
      }
      requestAnimationFrame(raf);
    }

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
   0.1 GLOBAL READING PROGRESS BAR (FIXED CINEMATIC SILVER LINE)
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
   0.2 DENNIS SNELLENBERG CINEMATIC HERO & SCROLL ANIMATION
   -------------------------------------------------------------------------- */
let marqueeScrollFactor = 0;

function initHeroReveal() {
  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  // Add revealed class for smooth initial load choreography
  requestAnimationFrame(() => {
    heroSection.classList.add('hero-revealed');
  });

  initHeroMarquee();
  initHeroCinematicScroll();
}

function initHeroMarquee() {
  const marqueeTrack = document.getElementById('hero-marquee-track');
  if (!marqueeTrack) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let marqueePos = 0;
  const baseSpeed = 0.055; // Smooth continuous crawl speed
  let scrollBoost = 0;
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

  // Scroll velocity listener to interact dynamically with user movement
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const diff = scrollY - lastScrollY;
    lastScrollY = scrollY;

    // Responsive boost based on scroll velocity
    scrollBoost = Math.max(-0.6, Math.min(0.6, diff * 0.018));
  }, { passive: true });

  function step() {
    // Decay the scroll boost back to 0 smoothly
    scrollBoost *= 0.94;

    marqueePos -= (baseSpeed + scrollBoost + marqueeScrollFactor);
    if (marqueePos <= -50) {
      marqueePos = 0;
    } else if (marqueePos > 0) {
      marqueePos = -50;
    }

    marqueeTrack.style.transform = `translate3d(${marqueePos}%, 0, 0)`;
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initHeroCinematicScroll() {
  const heroSection = document.getElementById('home');
  const portraitStage = document.getElementById('hero-portrait-stage');
  const portraitImg = document.getElementById('hero-center-portrait-img');
  const sideDetails = document.querySelectorAll('.hero-meta-right-role, .hero-meta-left-title');
  const marqueeTrack = document.getElementById('hero-marquee-track');

  if (!heroSection) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Use GSAP ScrollTrigger if loaded
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Scroll Timeline linked to scroll progress (scrub)
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          marqueeScrollFactor = Math.max(-0.6, Math.min(0.6, self.getVelocity() * 0.00035));
        }
      }
    });

    // A. Supporting right side name panel fades out smoothly in the first 25% of scroll
    if (sideDetails.length) {
      heroTl.to(sideDetails, {
        opacity: 0,
        y: -24,
        stagger: 0.02,
        ease: 'power2.in',
        duration: 0.25
      }, 0);
    }

    // B. Portrait cutout scales up slightly and shifts down with smooth parallax
    if (portraitStage) {
      heroTl.to(portraitStage, {
        yPercent: 14,
        ease: 'none',
        duration: 1
      }, 0);
    }

    if (portraitImg) {
      heroTl.to(portraitImg, {
        scale: 1.14,
        ease: 'power1.out',
        duration: 1
      }, 0);
    }

    // C. Oversized Name typography scrubs horizontally with scroll
    if (marqueeTrack) {
      heroTl.to(marqueeTrack, {
        xPercent: -22,
        ease: 'none',
        duration: 1
      }, 0);
    }

    // D. Portrait gently settles into the dark background transition
    if (portraitStage) {
      heroTl.to(portraitStage, {
        opacity: 0.2,
        ease: 'power2.in',
        duration: 0.35
      }, 0.65);
    }

    // 2. About Section Reveal Transition with text mask
    const aboutSection = document.getElementById('about');
    const aboutTitleText = aboutSection ? aboutSection.querySelector('.title-text') : null;
    const aboutSubtitle = aboutSection ? aboutSection.querySelector('.section-subtitle') : null;
    const aboutNarrative = aboutSection ? aboutSection.querySelector('.about-narrative') : null;
    const aboutHighlights = aboutSection ? aboutSection.querySelector('.about-highlights-grid') : null;

    if (aboutSection) {
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (aboutTitleText) {
        gsap.set(aboutTitleText, { y: '105%', opacity: 0 });
        aboutTl.to(aboutTitleText, {
          y: '0%',
          opacity: 1,
          duration: 1,
          ease: 'power4.out'
        });
      }

      if (aboutSubtitle) {
        aboutTl.from(aboutSubtitle, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.6');
      }

      if (aboutNarrative) {
        aboutTl.from(aboutNarrative, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        }, '-=0.5');
      }

      if (aboutHighlights) {
        aboutTl.from(aboutHighlights.children, {
          y: 25,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.6');
      }
    }
  } else {
    // Native fallback if GSAP is not present
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const heroH = heroSection.offsetHeight;
      if (scrollY < heroH + 100) {
        if (portraitStage) {
          portraitStage.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
        }
        if (portraitImg) {
          portraitImg.style.transform = `scale(${1 + scrollY * 0.00015})`;
        }
        corners.forEach((c) => {
          c.style.opacity = Math.max(0, 1 - scrollY / 250);
          c.style.transform = `translateY(-${scrollY * 0.1}px)`;
        });
        if (scrollIndicator) {
          scrollIndicator.style.opacity = Math.max(0, 1 - scrollY / 150);
        }
      }
    }, { passive: true });
  }
}

function initHeroParallax() {
  // Handled by initHeroCinematicScroll
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
   0.5 COMPACT PROJECTS SCROLL REVEAL & CARD ANIMATIONS
   -------------------------------------------------------------------------- */
function initProjectScrollEffects() {
  const projectsSection = document.getElementById('projects');
  const projectCards = document.querySelectorAll('.compact-project-card, .cinematic-project-card, .project-card');
  const projectsHeader = document.querySelector('.projects-header');

  if (!projectsSection && (!projectCards || projectCards.length === 0)) return;

  // Entrance Observer: Triggers choreographed entrance when section/cards enter view
  const entranceObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (projectsHeader) projectsHeader.classList.add('revealed');
        entry.target.classList.add('card-revealed');
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  if (projectCards && projectCards.length > 0) {
    projectCards.forEach((card) => entranceObserver.observe(card));
  } else if (projectsSection) {
    entranceObserver.observe(projectsSection);
  }
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
   1. NAVBAR SCROLL EFFECT & SCROLLSPY (SMOOTH SLIDING INDICATOR)
   -------------------------------------------------------------------------- */
let isProgrammaticScroll = false;
let programmaticScrollTimer = null;
let activeNavId = 'home';
let setGlobalActiveNav = null;

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  const navLinksContainer = document.querySelector('.nav-links');
  const indicator = document.querySelector('.nav-indicator');
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-links a');

  if (navLinksContainer && indicator) {
    navLinksContainer.classList.add('has-indicator');
  }

  const updateIndicator = (targetLink, immediate = false) => {
    if (!indicator || !navLinksContainer || !targetLink) return;

    const navRect = navLinksContainer.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    if (navRect.width === 0 || linkRect.width === 0) return;

    const x = linkRect.left - navRect.left;
    const y = linkRect.top - navRect.top;
    const width = linkRect.width;
    const height = linkRect.height;

    if (immediate) {
      indicator.style.transition = 'none';
    }

    indicator.style.top = `${y}px`;
    indicator.style.height = `${height}px`;
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${x}px)`;
    indicator.style.opacity = '1';

    if (immediate) {
      void indicator.offsetHeight; // Force reflow so transition: none takes effect
      indicator.style.transition = '';
    }
  };

  const setActiveNav = (id, immediate = false) => {
    if (!id) return;
    if (id === activeNavId && !immediate) return;
    activeNavId = id;

    let activeDesktopLink = null;
    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
        if (link.closest('.navbar-custom')) {
          activeDesktopLink = link;
        }
      } else {
        link.classList.remove('active');
      }
    });

    if (activeDesktopLink) {
      updateIndicator(activeDesktopLink, immediate);
    }
  };

  // Expose to anchor click handler
  setGlobalActiveNav = setActiveNav;

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

    // Skip section detection during programmatic scroll to prevent indicator jumping
    if (isProgrammaticScroll) return;

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
    const triggerPoint = Math.max(120, Math.min(220, Math.round(window.innerHeight * 0.3)));
    let currentId = 'home';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= triggerPoint && (rect.top + rect.height) > triggerPoint) {
        currentId = section.getAttribute('id');
      }
    });

    setActiveNav(currentId);
  };

  // rAF throttling for 60/120fps scroll performance
  let ticking = false;
  const throttledScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', throttledScroll, { passive: true });
  if (lenisInstance) {
    lenisInstance.on('scroll', throttledScroll);
  }

  // Window resize: re-align indicator without animation
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const activeLink = document.querySelector('.navbar-custom .nav-link.active');
      if (activeLink) {
        updateIndicator(activeLink, true);
      }
    }, 100);
  }, { passive: true });

  // Initial load alignment (immediate without visual slide from 0)
  requestAnimationFrame(() => {
    onScroll();
    const activeLink = document.querySelector('.navbar-custom .nav-link.active') ||
                      document.querySelector('.navbar-custom .nav-link[href="#home"]');
    if (activeLink) {
      updateIndicator(activeLink, true);
    }
  });
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
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
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
    if (!sectionEl) return 0;
    if (sectionEl.getAttribute('id') === 'home') return 0;
    return Math.max(0, Math.round(getTrueElementTop(sectionEl)));
  };

  // If page was opened with a hash in URL (e.g. /#about), scroll to section and clear the hash
  if (window.location.hash) {
    const initialTarget = document.querySelector(window.location.hash);
    if (initialTarget) {
      setTimeout(() => {
        const targetPos = window.location.hash === '#home'
          ? 0
          : getSectionTargetPos(initialTarget);

        const targetId = window.location.hash.substring(1);
        if (setGlobalActiveNav) {
          setGlobalActiveNav(targetId, true);
        }

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

        const targetId = hash.substring(1);

        // Lock programmatic scroll so intermediate sections don't flicker the active pill
        isProgrammaticScroll = true;
        clearTimeout(programmaticScrollTimer);

        // Set active class and smoothly slide indicator immediately to clicked item
        if (setGlobalActiveNav) {
          setGlobalActiveNav(targetId);
        }

        const targetPos = hash === '#home'
          ? 0
          : getSectionTargetPos(target);

        const onScrollFinished = () => {
          isProgrammaticScroll = false;
        };

        if (lenisInstance) {
          lenisInstance.scrollTo(targetPos, {
            duration: 1.15,
            onComplete: onScrollFinished
          });
          programmaticScrollTimer = setTimeout(onScrollFinished, 1250);
        } else {
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
          programmaticScrollTimer = setTimeout(onScrollFinished, 850);
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
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const brandMonogram = document.querySelector('.brand-monogram');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-drawer .btn');

  const mobileToggle = document.getElementById('mobile-toggle');

  if (!mobileDrawer || !mobileOverlay) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
      if (drawerCloseBtn) setTimeout(() => drawerCloseBtn.focus(), 150);
    } else {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
      }
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(true);
    });
  }

  // On touch/mobile viewports, tapping the brand monogram opens the drawer cleanly
  if (brandMonogram) {
    brandMonogram.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(true);
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => toggleMenu(false));
  }

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
   5.1 SKILLS HORIZONTAL MOVING MARQUEE (SMOOTH INFINITE LOOP & SCROLL PHYSICS)
   -------------------------------------------------------------------------- */
function initSkillsMarquee() {
  const container = document.getElementById('skillsMarquee');
  if (!container) return;

  const track = container.querySelector('.skills-marquee-track');
  if (!track) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let position = 0;
  const baseSpeed = 0.65; // pixels per frame at 60fps
  let currentSpeed = baseSpeed;
  let scrollVelocity = 0;
  let isHovered = false;
  let isDragging = false;
  let startX = 0;
  let dragStartPos = 0;
  let rafId = null;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

  // Track window scroll momentum to dynamically adjust speed and direction
  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Scrolling down accelerates right-to-left flow, scrolling up gently eases or reverses
      scrollVelocity += delta * 0.045;
      // Cap maximum momentum
      scrollVelocity = Math.max(-6, Math.min(6, scrollVelocity));
    },
    { passive: true }
  );

  // Hover detection: gently decelerate
  container.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Touch & Pointer drag support
  const onPointerDown = (e) => {
    isDragging = true;
    startX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
    dragStartPos = position;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.pageX || (e.touches && e.touches[0].pageX) || 0;
    const diff = currentX - startX;
    position = dragStartPos + diff;
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Main animation loop
  function loop() {
    if (!isDragging) {
      // Apply friction decay to scroll-induced velocity
      scrollVelocity *= 0.92;
      if (Math.abs(scrollVelocity) < 0.005) scrollVelocity = 0;

      // Target speed calculation (slow to 15% on hover)
      const targetSpeed = isHovered ? baseSpeed * 0.15 : baseSpeed;
      currentSpeed += (targetSpeed - currentSpeed) * 0.1;

      // Move leftwards
      position -= (currentSpeed + scrollVelocity);

      // Total track scrollWidth contains 2 identical groups
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        if (position <= -halfWidth) {
          position += halfWidth;
        } else if (position > 0) {
          position -= halfWidth;
        }
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;
    }

    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);
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
   8. MOVIES NEST INTERACTIVE SCREENSHOT GALLERY (FANNED STACK & INSPECTOR)
   -------------------------------------------------------------------------- */
function initMoviesNestGallery() {
  const modal = document.getElementById('movies-gallery-modal');
  const backdrop = document.getElementById('movies-gallery-backdrop');
  const closeBtn = document.getElementById('movies-gallery-close');
  const viewToggleBtn = document.getElementById('gallery-view-toggle');

  const fannedStage = document.getElementById('gallery-fanned-stack');
  const inspectStage = document.getElementById('gallery-inspect-view');

  const inspectImg = document.getElementById('inspect-main-img');
  const inspectStepBadge = document.getElementById('inspect-step-badge');
  const inspectFeaturePill = document.getElementById('inspect-feature-pill');
  const inspectTitle = document.getElementById('inspect-screen-title');
  const inspectDesc = document.getElementById('inspect-screen-desc');
  const statusText = document.getElementById('gallery-status-text');

  const prevBtn = document.getElementById('inspect-prev-btn');
  const nextBtn = document.getElementById('inspect-next-btn');

  const fannedCards = document.querySelectorAll('.fanned-card');
  const thumbPills = document.querySelectorAll('.thumb-pill');

  const phoneTrigger = document.getElementById('movies-phone-trigger');
  const actionBtnTrigger = document.getElementById('open-movies-gallery-action');

  if (!modal) return;

  const screens = [
    {
      image: 'movies-nest-1.jpg',
      title: 'Home Screen',
      step: 'Screen 1 of 4',
      badge: 'Trending & Featured Feeds',
      desc: 'Movies Nest home screen featuring the "Welcome to Derry / IT" banner with instant playback controls, followed by curated carousels for Trending Movies and Upcoming releases with bottom navigation.'
    },
    {
      image: 'movies-nest-2.jpg',
      title: 'Movie Details',
      step: 'Screen 2 of 4',
      badge: '4K HDR & Trailer Player',
      desc: 'Deep-dive cinema details for "Crime 101" displaying high-resolution header art, 6.9 rating, release date, 4K HDR badge, "Play Trailer" and "Add to Watchlist" actions, and complete story synopsis.'
    },
    {
      image: 'movies-nest-3.jpg',
      title: 'Search Screen',
      step: 'Screen 3 of 4',
      badge: 'Fast Movie Exploration',
      desc: 'Dynamic movie search interface with quick-filter query bar and a multi-column responsive poster grid presenting "Recommended For You" cinema selections like Mercy, Crime 101, Scream 7, and Marty Supreme.'
    },
    {
      image: 'movies-nest-4.png',
      title: 'My Watchlist',
      step: 'Screen 4 of 4',
      badge: 'Saved Movies & Ratings',
      desc: 'Clean personal watchlist management screen showcasing user-saved titles with cover posters, star ratings, release dates, and quick removal controls for tracking upcoming movie nights.'
    }
  ];

  let currentScreenIndex = 0;
  let currentMode = 'stack'; // 'stack' or 'inspect'

  // Update inspection view content
  const updateInspectView = (index) => {
    if (index < 0) index = screens.length - 1;
    if (index >= screens.length) index = 0;
    currentScreenIndex = index;

    const screen = screens[currentScreenIndex];

    if (inspectImg) {
      inspectImg.style.opacity = '0';
      setTimeout(() => {
        inspectImg.src = screen.image;
        inspectImg.alt = `Movies Nest - ${screen.title}`;
        inspectImg.style.opacity = '1';
      }, 120);
    }

    if (inspectStepBadge) inspectStepBadge.textContent = screen.step;
    if (inspectFeaturePill) inspectFeaturePill.textContent = screen.badge;
    if (inspectTitle) inspectTitle.textContent = screen.title;
    if (inspectDesc) inspectDesc.textContent = screen.desc;
    if (statusText) statusText.textContent = `${screen.step} • ${screen.title}`;

    thumbPills.forEach((pill) => {
      const pIdx = parseInt(pill.getAttribute('data-index'), 10);
      const isActive = pIdx === currentScreenIndex;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  // Switch between Stack and Inspect modes
  const setMode = (mode, screenIdx = null) => {
    currentMode = mode;
    if (mode === 'stack') {
      if (fannedStage) fannedStage.removeAttribute('hidden');
      if (inspectStage) inspectStage.setAttribute('hidden', '');
      if (viewToggleBtn) {
        viewToggleBtn.classList.remove('active');
        viewToggleBtn.style.display = 'none';
      }
      if (statusText) statusText.textContent = 'Interactive App Showcase • 4 Screens';
    } else {
      if (screenIdx !== null) {
        updateInspectView(screenIdx);
      }
      if (fannedStage) fannedStage.setAttribute('hidden', '');
      if (inspectStage) inspectStage.removeAttribute('hidden');
      if (viewToggleBtn) {
        viewToggleBtn.classList.add('active');
        viewToggleBtn.style.display = 'inline-flex';
      }
    }
  };

  // Open modal
  const openGalleryModal = (startMode = 'stack', screenIdx = 0) => {
    modal.removeAttribute('hidden');
    // Force reflow for CSS transition
    void modal.offsetWidth;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Pause lenis if active
    if (lenisInstance && typeof lenisInstance.stop === 'function') {
      lenisInstance.stop();
    }

    setMode(startMode, screenIdx);
  };

  // Close modal
  const closeGalleryModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';

    // Resume lenis if active
    if (lenisInstance && typeof lenisInstance.start === 'function') {
      lenisInstance.start();
    }

    setTimeout(() => {
      modal.setAttribute('hidden', '');
      setMode('stack');
    }, 400);
  };

  // Wire trigger buttons
  if (phoneTrigger) {
    phoneTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openGalleryModal('stack');
    });
    phoneTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGalleryModal('stack');
      }
    });
  }

  if (actionBtnTrigger) {
    actionBtnTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openGalleryModal('stack');
    });
  }

  // Clicking any fanned card opens inspector mode for that screen
  fannedCards.forEach((card) => {
    const handleCardSelect = () => {
      const idx = parseInt(card.getAttribute('data-screen-index'), 10) || 0;
      setMode('inspect', idx);
    };

    card.addEventListener('click', handleCardSelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardSelect();
      }
    });
  });

  // Mode toggle (Back to Stack)
  if (viewToggleBtn) {
    viewToggleBtn.addEventListener('click', () => {
      setMode('stack');
    });
  }

  // Close buttons
  if (closeBtn) closeBtn.addEventListener('click', closeGalleryModal);
  if (backdrop) backdrop.addEventListener('click', closeGalleryModal);

  // Prev / Next navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateInspectView(currentScreenIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateInspectView(currentScreenIndex + 1);
    });
  }

  // Thumbnail pills
  thumbPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const idx = parseInt(pill.getAttribute('data-index'), 10);
      if (!isNaN(idx)) updateInspectView(idx);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      if (currentMode === 'inspect') {
        setMode('stack');
      } else {
        closeGalleryModal();
      }
    } else if (currentMode === 'inspect') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateInspectView(currentScreenIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateInspectView(currentScreenIndex + 1);
      }
    }
  });

  // Touch Swipe Gesture for mobile inspection
  const inspectDeviceWrap = document.getElementById('inspect-device-wrap');
  if (inspectDeviceWrap) {
    let touchStartX = 0;
    let touchStartY = 0;

    inspectDeviceWrap.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    inspectDeviceWrap.addEventListener('touchend', (e) => {
      if (!touchStartX || !e.changedTouches || e.changedTouches.length === 0) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant and exceeds threshold
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          // Swiped left -> next screen
          updateInspectView(currentScreenIndex + 1);
        } else {
          // Swiped right -> previous screen
          updateInspectView(currentScreenIndex - 1);
        }
      }
      touchStartX = 0;
      touchStartY = 0;
    }, { passive: true });
  }
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
