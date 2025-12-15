/**
 * StrokeSense - JavaScript for animations and interactivity
 * Pure vanilla JavaScript implementation
 */

(function() {
  'use strict';

  /**
   * Initialize all animations and interactions when DOM is ready
   */
  // Global Lenis instance for smooth scrolling
  let lenisInstance = null;

  function init() {
    // Reset scroll position to top on page load/refresh
    scrollToTopOnLoad();
    
    // Initialize Lenis smooth scroll
    initLenisScroll();
    
    // Animate navbar elements with stagger effect
    animateNavbarOnLoad();
    
    initHeroLottie();
    initFeatureIcons();
    initForEveryoneLottie();
    animateDemoSection();
    setupNavbar();
    setupSmoothScroll();
    setupScrollAnimations();
    setupScrollTriggerForFeatures();
    setupScrollTriggerForFooter();
    setupFormHandling();
    setupTimelineProgress();
    setupBackToTop();
  }

  /**
   * Initialize Lenis smooth scroll
   * Creates buttery smooth scrolling experience
   */
  function initLenisScroll() {
    // Check if Lenis is available
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis library not loaded');
      return;
    }

    // Initialize Lenis with smooth settings
    lenisInstance = new Lenis({
      duration: 1.2,           // Scroll duration (higher = smoother but slower)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      orientation: 'vertical', // Scroll orientation
      gestureOrientation: 'vertical',
      smoothWheel: true,       // Smooth mouse wheel scrolling
      wheelMultiplier: 1,      // Mouse wheel speed multiplier
      touchMultiplier: 2,      // Touch device speed multiplier
      infinite: false,         // No infinite scroll
    });

    // Animation frame loop for Lenis
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with anchor links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          // Use Lenis scrollTo for smooth navigation
          lenisInstance.scrollTo(targetElement, {
            offset: -100, // Offset for fixed navbar
            duration: 1.2,
          });
        }
      });
    });

    // Handle logo click - scroll to top
    const logo = document.querySelector('.navbar-logo');
    if (logo) {
      logo.addEventListener('click', function(e) {
        e.preventDefault();
        lenisInstance.scrollTo(0, { duration: 1.2 });
      });
    }

    // Handle back-to-top button with Lenis
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        lenisInstance.scrollTo(0, { duration: 1.2 });
      });
    }

    console.log('Lenis smooth scroll initialized');
  }

  /**
   * Reset scroll position to top on page load/refresh
   * Ensures the page always starts from the top
   */
  function scrollToTopOnLoad() {
    // Use both methods for maximum browser compatibility
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }

  /**
   * Coordinated entrance animations for navbar and hero
   * Navbar animates first with stagger, then hero elements animate
   * Uses CSS classes for smooth, glitch-free transitions
   */
  function animateNavbarOnLoad() {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section');
    if (!navbar) return;

    // Collect navbar elements (including hamburger toggle for mobile)
    const logo = navbar.querySelector('.navbar-logo');
    const navLinks = Array.from(navbar.querySelectorAll('.navbar-links .nav-link'));
    const authElements = Array.from(navbar.querySelectorAll('.navbar-auth > *'));
    const hamburgerToggle = navbar.querySelector('.navbar-toggle');
    
    // Check if mobile view (hamburger visible, nav links hidden)
    const isMobile = window.innerWidth <= 991;
    
    // On mobile: logo and hamburger animate together
    // On desktop: all elements stagger
    let navElements;
    if (isMobile) {
      // Mobile: logo and hamburger as a group (same timing)
      navElements = [[logo, hamburgerToggle].filter(el => el)]; // Array of arrays for grouped animation
    } else {
      // Desktop: stagger all elements
      navElements = [logo, ...navLinks, ...authElements].filter(el => el);
    }
    
    // Collect hero elements in order
    const heroTitle = heroSection?.querySelector('.hero-title');
    const heroDescription = heroSection?.querySelector('.hero-description');
    const heroButtons = heroSection?.querySelector('.hero-buttons');
    const heroTrust = heroSection?.querySelector('.hero-trust-container');
    const heroVisual = heroSection?.querySelector('.hero-visual');
    const heroElements = [heroTitle, heroDescription, heroButtons, heroTrust, heroVisual].filter(el => el);
    
    // TIMING CONFIGURATION
    const initialDelay = 100;      // Wait for page to fully settle
    const navStaggerDelay = 60;    // Delay between navbar elements
    const heroStartDelay = 300;    // Delay after navbar starts before hero starts
    const heroStaggerDelay = 100;  // Delay between hero elements
    
    // PHASE 1: Animate navbar elements with stagger
    setTimeout(() => {
      if (isMobile) {
        // Mobile: animate logo and hamburger together (same timing)
        navElements[0].forEach(el => {
          el.classList.add('nav-visible');
        });
      } else {
        // Desktop: stagger animation
        navElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('nav-visible');
          }, index * navStaggerDelay);
        });
      }
      
      // PHASE 2: After navbar animation starts, animate hero with stagger
      setTimeout(() => {
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('hero-visible');
          }, index * heroStaggerDelay);
        });
      }, heroStartDelay);
      
    }, initialDelay);
  }

  /**
   * Initialize Lottie animation for hero section
   * Loads and plays the hero animation from the assets folder
   * Supports both .json and .lottie file formats
   * Uses multiple loading strategies for maximum compatibility
   */
  function initHeroLottie() {
    // Check if Lottie library is loaded
    if (typeof lottie === 'undefined') {
      console.warn('Lottie library not loaded');
      return;
    }

    const lottieContainer = document.getElementById('hero-lottie');
    if (!lottieContainer) {
      console.warn('Lottie container not found');
      return;
    }

    // Ensure container is visible and properly sized
    lottieContainer.style.display = 'block';
    lottieContainer.style.visibility = 'visible';
    lottieContainer.style.opacity = '1';

    // Try loading .json file first (extracted from .lottie archive)
    // The .lottie format is a ZIP archive that contains JSON, so we use the JSON directly
    loadLottieAnimation('assets/hero_animation.json', function() {
      // If .json fails, try .lottie as fallback (though it may not work with standard lottie-web)
      console.log('Trying .lottie fallback...');
      loadLottieAnimation('assets/hero_animation.lottie', function() {
        // If both fail, show error message
        console.error('Both .json and .lottie formats failed to load');
        lottieContainer.innerHTML = '<div style="text-align: center; color: #6B6B6B; padding: 2rem; font-family: var(--font-body);">Animation file not found. Please ensure hero_animation.json exists in the assets folder.</div>';
      });
    });

    /**
     * Load Lottie animation with error handling
     * @param {string} animationPath - Path to the animation file
     * @param {Function} onError - Callback if loading fails
     */
    function loadLottieAnimation(animationPath, onError) {
      console.log('Attempting to load Lottie animation from:', animationPath);
      
      const animationConfig = {
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animationPath
      };

      let animation;
      let hasLoaded = false;
      let errorTimeout;

      try {
        animation = lottie.loadAnimation(animationConfig);
        
        // Set a timeout to detect if loading fails silently
        errorTimeout = setTimeout(function() {
          if (!hasLoaded) {
            console.warn('Animation loading timeout for:', animationPath);
            if (onError && typeof onError === 'function') {
              onError();
            }
          }
        }, 5000); // 5 second timeout
        
        // Handle successful animation load
        const onDataReady = function() {
          if (!hasLoaded) {
            hasLoaded = true;
            clearTimeout(errorTimeout);
            console.log('Hero Lottie animation loaded successfully from:', animationPath);
            lottieContainer.style.opacity = '1';
            lottieContainer.style.visibility = 'visible';
            // Remove error listeners since we succeeded
            if (animation) {
              animation.removeEventListener('data_failed', onDataFailed);
            }
          }
        };

        // Handle animation load failure
        const onDataFailed = function() {
          if (!hasLoaded) {
            clearTimeout(errorTimeout);
            console.warn('Failed to load animation from:', animationPath);
            if (onError && typeof onError === 'function') {
              onError();
            }
          }
        };

        // Multiple event listeners to catch different loading scenarios
        animation.addEventListener('data_ready', onDataReady);
        animation.addEventListener('DOMLoaded', onDataReady);
        animation.addEventListener('config_ready', onDataReady);
        animation.addEventListener('data_failed', onDataFailed);

        // Also check if animation is already loaded (for cached files)
        if (animation.isLoaded) {
          onDataReady();
        }

      } catch (error) {
        clearTimeout(errorTimeout);
        console.error('Error initializing Lottie animation:', error);
        if (onError && typeof onError === 'function') {
          onError();
        }
      }
    }
  }

  /**
   * Initialize Lottie animations for feature icons
   * Loads icon1.json, icon2.json, and icon3.json for the three feature cards
   */
  function initFeatureIcons() {
    // Check if Lottie library is loaded
    if (typeof lottie === 'undefined') {
      console.warn('Lottie library not loaded');
      return;
    }

    // Icon 1: Gamified Learning (rocket)
    const icon1Container = document.getElementById('feature-icon-1');
    if (icon1Container) {
      lottie.loadAnimation({
        container: icon1Container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/icon1.json'
      });
    }

    // Icon 2: Real-Time AI Feedback (AI decision)
    const icon2Container = document.getElementById('feature-icon-2');
    if (icon2Container) {
      lottie.loadAnimation({
        container: icon2Container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/icon2.json'
      });
    }

    // Icon 3: Cultural Preservation (sunrise)
    const icon3Container = document.getElementById('feature-icon-3');
    if (icon3Container) {
      lottie.loadAnimation({
        container: icon3Container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/icon3.json'
      });
    }
  }

  /**
   * Initialize Lottie animation for "For Everyone" section
   * Loads anyone.json animation
   */
  function initForEveryoneLottie() {
    // Check if Lottie library is loaded
    if (typeof lottie === 'undefined') {
      console.warn('Lottie library not loaded');
      return;
    }

    const lottieContainer = document.getElementById('for-everyone-lottie');
    if (!lottieContainer) {
      console.warn('For Everyone Lottie container not found');
      return;
    }

    lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/anyone.json'
    });
  }

  /**
   * Setup navbar scroll detection and morphing
   * Transitions from flat transparent header to pill-shaped navbar on scroll
   */
  function setupNavbar() {
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMobile = document.getElementById('navbar-mobile');
    const navbarBackdrop = document.getElementById('navbar-mobile-backdrop');
    
    if (!navbar) return;

    // Scroll threshold for navbar morphing (when to switch from flat to pill)
    const scrollThreshold = 100;

    /**
     * Handle scroll event to toggle navbar state
     */
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY > scrollThreshold) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Check initial scroll position
    handleScroll();

    /**
     * Mobile menu toggle functionality
     * Handles opening/closing the mobile menu and backdrop overlay
     */
    if (navbarToggle && navbarMobile) {
      /**
       * Toggle mobile menu open/closed state
       */
      function toggleMobileMenu() {
        const isActive = navbarMobile.classList.contains('active');
        navbarToggle.classList.toggle('active');
        navbarMobile.classList.toggle('active');
        if (navbarBackdrop) {
          navbarBackdrop.classList.toggle('active');
        }
        document.body.style.overflow = !isActive ? 'hidden' : '';
      }

      /**
       * Close mobile menu
       */
      function closeMobileMenu() {
        navbarToggle.classList.remove('active');
        navbarMobile.classList.remove('active');
        if (navbarBackdrop) {
          navbarBackdrop.classList.remove('active');
        }
        document.body.style.overflow = '';
      }

      // Toggle menu when hamburger button is clicked
      navbarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
      });

      // Close mobile menu when clicking on a link
      // Updated to use .nav-link instead of .mobile-nav-link to match new HTML structure
      const mobileLinks = navbarMobile.querySelectorAll('.nav-link, .btn');
      mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
          closeMobileMenu();
        });
      });

      // Close mobile menu when clicking on the backdrop
      if (navbarBackdrop) {
        navbarBackdrop.addEventListener('click', function() {
          closeMobileMenu();
        });
      }

      // Close mobile menu when clicking outside (but not on the toggle button)
      document.addEventListener('click', function(e) {
        if (navbarMobile.classList.contains('active')) {
          // Close if clicking outside the mobile menu and not on the toggle button
          if (!navbarMobile.contains(e.target) && 
              !navbarToggle.contains(e.target) &&
              e.target !== navbarBackdrop) {
            closeMobileMenu();
          }
        }
      });
    }
  }

  /**
   * Orchestrate demo section animations in sequence (with looping):
   * 1. Empty canvas with grey guide (initial state)
   * 2. Stroke drawing animation (2s) - using JavaScript for precise control
   * 3. Fill appears INSTANTLY when stroke completes (no fade - prevents glitches)
   * 4. Bubble pops in (after fill)
   * 5. Mastery counter animates (after bubble)
   * 6. Hold for a moment, then reset and loop
   * 
   * IMPORTANT: No CSS transitions on fill/stroke to prevent holding state glitches
   */
  function animateDemoSection() {
    const demoSection = document.querySelector('#demo');
    const stroke = document.querySelector('.baybayin-stroke');
    const fill = document.querySelector('.baybayin-fill');
    const bubble = document.querySelector('.canvas-feedback');
    const masteryPercent = document.getElementById('mastery-percent');
    const masteryBar = document.getElementById('mastery-bar');
    
    if (!demoSection || !stroke) return;
    
    // Get actual path length for accurate animation
    const pathLength = stroke.getTotalLength();
    
    // Animation state
    let isVisible = false;
    let animationTimeouts = [];
    let loopTimeout = null;
    let strokeAnimationId = null;
    let fillAnimationId = null;
    let bubbleAnimationId = null;
    
    // TIMING CONFIGURATION (in milliseconds)
    const STROKE_DURATION = 2000;      // Time for stroke to draw
    const FILL_DELAY = 100;            // Short delay after stroke before fill
    const BUBBLE_DELAY = 300;          // Delay after fill before bubble
    const MASTERY_DELAY = 400;         // Delay after bubble before mastery
    const MASTERY_DURATION = 1500;     // Duration of mastery count-up
    const HOLD_DURATION = 2000;        // Hold complete state before reset
    const RESET_DURATION = 500;        // Pause before next loop
    const TARGET_PERCENTAGE = 85;
    
    // LOCK all transitions on character elements to prevent any CSS interference
    stroke.style.transition = 'none';
    if (fill) fill.style.transition = 'none';
    
    // Initialize stroke with correct dasharray
    stroke.style.strokeDasharray = pathLength;
    stroke.style.strokeDashoffset = pathLength; // Fully hidden
    stroke.style.opacity = '1';
    
    // Initialize fill as hidden
    if (fill) fill.style.opacity = '0';
    
    /**
     * Reset all elements to initial hidden state (instant, no transitions)
     */
    function resetAnimation() {
      // Clear any pending timeouts and animations
      animationTimeouts.forEach(id => clearTimeout(id));
      animationTimeouts = [];
      if (loopTimeout) {
        clearTimeout(loopTimeout);
        loopTimeout = null;
      }
      if (strokeAnimationId) {
        cancelAnimationFrame(strokeAnimationId);
        strokeAnimationId = null;
      }
      if (fillAnimationId) {
        cancelAnimationFrame(fillAnimationId);
        fillAnimationId = null;
      }
      if (bubbleAnimationId) {
        cancelAnimationFrame(bubbleAnimationId);
        bubbleAnimationId = null;
      }
      
      // Reset stroke - completely hidden, ready for next draw
      if (stroke) {
        stroke.style.strokeDashoffset = pathLength;
        stroke.style.opacity = '1';
      }
      
      // Reset fill - hidden
      if (fill) {
        fill.style.opacity = '0';
      }
      
      // Reset bubble - hidden instantly (no transition)
      if (bubble) {
        bubble.style.transition = 'none';
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0) rotate(-10deg)';
        bubble.offsetHeight; // Force reflow
      }
      
      // Reset mastery
      if (masteryPercent) {
        masteryPercent.textContent = '0';
      }
      if (masteryBar) {
        masteryBar.style.width = '0%';
      }
    }
    
    /**
     * Animate stroke drawing using JavaScript for precise control
     */
    function animateStroke(onComplete) {
      const startTime = performance.now();
      
      // Ensure stroke is visible and ready
      stroke.style.opacity = '1';
      stroke.style.strokeDashoffset = pathLength;
      
      function draw(currentTime) {
        if (!isVisible) return;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / STROKE_DURATION, 1);
        
        // Ease in-out for smooth drawing
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        // Calculate dashoffset (pathLength = hidden, 0 = fully drawn)
        const offset = pathLength * (1 - eased);
        stroke.style.strokeDashoffset = offset;
        
        if (progress < 1) {
          strokeAnimationId = requestAnimationFrame(draw);
        } else {
          strokeAnimationId = null;
          if (onComplete) onComplete();
        }
      }
      
      strokeAnimationId = requestAnimationFrame(draw);
    }
    
    /**
     * Show fill using JavaScript animation (no CSS transition)
     * Simultaneously hides stroke for smooth swap
     */
    function showFill(onComplete) {
      if (!fill) {
        if (onComplete) onComplete();
        return;
      }
      
      const duration = 300; // 300ms fade
      const startTime = performance.now();
      
      function animate(currentTime) {
        if (!isVisible) return;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out for smooth appearance
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Fade in fill, fade out stroke simultaneously
        fill.style.opacity = eased;
        stroke.style.opacity = 1 - eased;
        
        if (progress < 1) {
          fillAnimationId = requestAnimationFrame(animate);
        } else {
          fillAnimationId = null;
          // Ensure final state is locked
          fill.style.opacity = '1';
          stroke.style.opacity = '0';
          if (onComplete) onComplete();
        }
      }
      
      fillAnimationId = requestAnimationFrame(animate);
    }
    
    /**
     * Show bubble using JavaScript animation (no CSS transition during hold)
     */
    function showBubble(onComplete) {
      if (!bubble) {
        if (onComplete) onComplete();
        return;
      }
      
      const duration = 300;
      const startTime = performance.now();
      
      function animate(currentTime) {
        if (!isVisible) return;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Bounce easing for pop effect
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        const scale = 0.5 + (eased * 0.5); // Scale from 0.5 to 1
        const overshoot = progress < 0.7 ? 1 + (progress * 0.15) : 1; // Slight overshoot
        
        bubble.style.opacity = eased;
        bubble.style.transform = `scale(${scale * overshoot}) rotate(${(1 - eased) * -10}deg)`;
        
        if (progress < 1) {
          bubbleAnimationId = requestAnimationFrame(animate);
        } else {
          bubbleAnimationId = null;
          // Lock final state
          bubble.style.opacity = '1';
          bubble.style.transform = 'scale(1) rotate(0deg)';
          if (onComplete) onComplete();
        }
      }
      
      bubbleAnimationId = requestAnimationFrame(animate);
    }
    
    /**
     * Count up animation for mastery percentage
     * Uses pure JavaScript for both number and bar
     */
    function animateMastery(onComplete) {
      if (!masteryPercent || !masteryBar) {
        if (onComplete) onComplete();
        return;
      }
      
      const startTime = performance.now();
      
      function updateCount(currentTime) {
        if (!isVisible) return;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / MASTERY_DURATION, 1);
        
        // Ease out expo for satisfying deceleration
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        // Calculate exact percentage
        const exactValue = TARGET_PERCENTAGE * easeOutExpo;
        const displayValue = Math.round(exactValue);
        
        // Update both in the same frame for perfect sync
        masteryPercent.textContent = displayValue;
        masteryBar.style.width = `${exactValue}%`;
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          // Lock final values
          masteryPercent.textContent = TARGET_PERCENTAGE;
          masteryBar.style.width = `${TARGET_PERCENTAGE}%`;
          if (onComplete) onComplete();
        }
      }
      
      requestAnimationFrame(updateCount);
    }
    
    /**
     * Run the full animation sequence (loops while visible)
     */
    function runAnimationSequence() {
      if (!isVisible) return;
      
      // STEP 1: Draw stroke
      animateStroke(() => {
        if (!isVisible) return;
        
        // STEP 2: Swap stroke for fill after short delay
        const fillTimeout = setTimeout(() => {
          if (!isVisible) return;
          
          showFill(() => {
            if (!isVisible) return;
            
            // STEP 3: Show bubble after delay
            const bubbleTimeout = setTimeout(() => {
              if (!isVisible) return;
              
              showBubble(() => {
                if (!isVisible) return;
                
                // STEP 4: Animate mastery after delay
                const masteryTimeout = setTimeout(() => {
                  if (!isVisible) return;
                  
                  animateMastery(() => {
                    if (!isVisible) return;
                    
                    // STEP 5: Hold, then reset and loop
                    loopTimeout = setTimeout(() => {
                      if (!isVisible) return;
                      
                      // Reset everything
                      resetAnimation();
                      
                      // Pause before next loop
                      const restartTimeout = setTimeout(() => {
                        if (isVisible) {
                          runAnimationSequence();
                        }
                      }, RESET_DURATION);
                      animationTimeouts.push(restartTimeout);
                      
                    }, HOLD_DURATION);
                  });
                }, MASTERY_DELAY);
                animationTimeouts.push(masteryTimeout);
              });
            }, BUBBLE_DELAY);
            animationTimeouts.push(bubbleTimeout);
          });
        }, FILL_DELAY);
        animationTimeouts.push(fillTimeout);
      });
    }
    
    // Initialize to reset state
    resetAnimation();
    
    // Intersection Observer to trigger animation when demo section is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
          runAnimationSequence();
        } else {
          isVisible = false;
          resetAnimation();
        }
      });
    }, {
      threshold: 0.25, // Trigger when 25% of demo section is visible
      rootMargin: '0px'
    });
    
    observer.observe(demoSection);
  }

  /**
   * Setup smooth scroll for navigation links and buttons
   * Handles all anchor links with smooth scrolling and offset for fixed navbar
   * Enhanced with custom smooth scrolling for better performance
   */
  /**
   * Setup smooth scroll for navigation links and buttons
   * Uses Lenis if available, otherwise falls back to native/custom smooth scroll
   */
  function setupSmoothScroll() {
    // If Lenis is active, it handles anchor links - only setup fallback for "Learn more" button
    // The initLenisScroll function already handles anchor links and logo
    
    // Offset to account for fixed navbar height
    const navbarOffset = 100;

    /**
     * Smooth scroll to element - uses Lenis if available, otherwise native
     */
    function smoothScrollTo(targetId) {
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      // Use Lenis if available
      if (lenisInstance) {
        lenisInstance.scrollTo(targetElement, {
          offset: -navbarOffset,
          duration: 1.2,
        });
      } else {
        // Fallback to native smooth scroll
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }

    // Handle "Learn more" button in hero - scrolls to features section
    const learnMoreBtn = document.querySelector('.hero-section .btn-secondary');
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScrollTo('features');
      });
    }
  }

  /**
   * Setup scroll-triggered animations using Intersection Observer
   * Animates elements as they come into view with smooth, theme-matching effects
   * Includes stagger effects for grid items and sequential animations
   */
  function setupScrollAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    /**
     * Handle stagger animations for grid items
     * Adds sequential delay to children elements
     */
    function setupStaggerAnimation(parent, childSelector, baseDelay = 100) {
      const children = parent.querySelectorAll(childSelector);
      children.forEach((child, index) => {
        if (!child.hasAttribute('data-animate')) {
          child.setAttribute('data-animate', 'fade-in-up');
        }
        const delay = index * baseDelay;
        if (delay > 0) {
          child.setAttribute('data-animate-delay', delay.toString());
        }
      });
    }

    // Feature cards use scroll trigger instead of Intersection Observer
    // Skip setting up stagger animations here - handled by setupScrollTriggerForFeatures

    // Setup stagger animations for stats
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
      setupStaggerAnimation(statsGrid, '.stat-item', 150);
    }

    // Setup stagger animations for zigzag timeline content (badges, titles, descriptions)
    // Icons should remain static without animations
    const zigzagTimeline = document.querySelector('.zigzag-timeline');
    if (zigzagTimeline) {
      setupStaggerAnimation(zigzagTimeline, '.zigzag-content', 150);
    }

    // Create intersection observer with smooth trigger points
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay for smoother appearance
          const delay = entry.target.getAttribute('data-animate-delay') || 0;
          
          setTimeout(() => {
            entry.target.classList.add('animate-in');
            // Stop observing once animated
            observer.unobserve(entry.target);
          }, parseInt(delay));
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: '0px 0px -100px 0px' // Trigger earlier, before element fully enters viewport
    });

    // Observe all elements with data-animate attribute
    // Exclude zigzag timeline icons and rows (they should remain static)
    // Features section (header + cards) is handled by setupScrollTriggerForFeatures (no data-animate needed)
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      // Skip zigzag timeline icons and rows - they should stay in place without animation
      if (el.closest('.zigzag-timeline') && (el.classList.contains('zigzag-icon-container') || el.classList.contains('zigzag-row'))) {
        return; // Skip these elements - they remain static
      }
      
      // Initially hide the element (CSS handles this, but ensure it's set)
      if (el.style.opacity === '') {
        el.style.opacity = '0';
      }
      observer.observe(el);
    });
  }

  /**
   * Setup scroll trigger for Features section header and cards
   * Triggers animation when user scrolls to the section using scroll position
   * STRICT ORDER: Header animates first, then cards animate with stagger after header is done
   * Uses CSS classes for initial hidden state to prevent flash of content
   */
  function setupScrollTriggerForFeatures() {
    const featuresSection = document.querySelector('#features');
    if (!featuresSection) return;

    const featuresHeader = featuresSection.querySelector('.section-header');
    const featureCards = Array.from(featuresSection.querySelectorAll('.feature-card'));
    
    if (!featuresHeader) return;

    // Initial state is set via CSS (opacity: 0, transform: translateY(30px))
    // No need to set inline styles here - CSS handles initial hidden state
    
    let hasTriggered = false;

    /**
     * Animate header first, then cards in sequence
     * Uses CSS class 'features-visible' for animation
     */
    function animateFeaturesSection() {
      if (hasTriggered) return;
      hasTriggered = true;
      
      // STEP 1: Animate header FIRST (immediately)
      featuresHeader.classList.add('features-visible');
      
      // STEP 2: After header animation completes (600ms), start animating cards
      const headerAnimationDuration = 600;
      const cardStaggerDelay = 150; // Delay between each card
      
      setTimeout(() => {
        featureCards.forEach((card, index) => {
          // Stagger each card by cardStaggerDelay
          setTimeout(() => {
            card.classList.add('features-visible');
          }, index * cardStaggerDelay);
        });
      }, headerAnimationDuration);
    }

    /**
     * Check scroll position and trigger animations
     * Only triggers when the features section is actually scrolled into view
     * Prevents triggering when features section is in the initial viewport (hero area)
     */
    function checkScrollPosition() {
      if (hasTriggered) return;
      
      const sectionRect = featuresSection.getBoundingClientRect();
      const headerRect = featuresHeader.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Only trigger when:
      // 1. The section header is in the viewport (top < 80% of viewport height)
      // 2. The section is not above the viewport (bottom > 0)
      // 3. User has scrolled at least a bit (section top is not at the very top of page)
      const triggerPoint = windowHeight * 0.85;
      const hasScrolled = window.scrollY > 50; // Ensure some scroll has happened
      
      if (headerRect.top < triggerPoint && headerRect.bottom > 0 && hasScrolled) {
        animateFeaturesSection();
      }
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Don't check on initial load - wait for user to scroll
    // This prevents the glitch where features show up before scrolling
  }

  /**
   * Setup scroll trigger for Footer section
   * Triggers animation when user scrolls to the footer
   * Columns animate with stagger, then footer bottom appears
   */
  function setupScrollTriggerForFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const footerCols = Array.from(footer.querySelectorAll('.footer-col'));
    const footerBottom = footer.querySelector('.footer-bottom');
    
    if (footerCols.length === 0) return;

    // Initial state is set via CSS (opacity: 0, transform: translateY(25px))
    
    let hasTriggered = false;

    /**
     * Animate footer columns with stagger, then footer bottom
     */
    function animateFooter() {
      if (hasTriggered) return;
      hasTriggered = true;
      
      const colStaggerDelay = 100; // Delay between each column
      
      // Animate columns with stagger
      footerCols.forEach((col, index) => {
        setTimeout(() => {
          col.classList.add('footer-visible');
        }, index * colStaggerDelay);
      });
      
      // Animate footer bottom after all columns
      const footerBottomDelay = footerCols.length * colStaggerDelay + 200;
      setTimeout(() => {
        if (footerBottom) {
          footerBottom.classList.add('footer-visible');
        }
      }, footerBottomDelay);
    }

    /**
     * Check scroll position and trigger animations
     */
    function checkScrollPosition() {
      if (hasTriggered) return;
      
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Trigger when footer reaches 90% down the viewport
      const triggerPoint = windowHeight * 0.95;
      
      if (footerRect.top < triggerPoint && footerRect.bottom > 0) {
        animateFooter();
      }
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Setup timeline progress animation
   * Fills the timeline line as user scrolls through the "How It Works" section
   * Line starts and ends exactly at the center of the first and last icons
   */
  function setupTimelineProgress() {
    const timeline = document.querySelector('.zigzag-timeline');
    if (!timeline) return;

    const icons = timeline.querySelectorAll('.zigzag-icon-container');
    if (icons.length < 2) return;

    const firstIcon = icons[0];
    const lastIcon = icons[icons.length - 1];

    /**
     * Calculate and set the line position based on icon centers
     * Line starts at the center of the first icon and ends at the center of the last icon
     * Line does not extend beyond the icons
     */
    function updateLinePosition() {
      const timelineRect = timeline.getBoundingClientRect();
      const icons = Array.from(timeline.querySelectorAll('.zigzag-icon-container'));
      
      if (icons.length < 2) return;
      
      const firstIcon = icons[0];
      const lastIcon = icons[icons.length - 1];
      const firstIconRect = firstIcon.getBoundingClientRect();
      const lastIconRect = lastIcon.getBoundingClientRect();

      // Calculate icon center positions relative to the timeline container
      const firstIconCenterY = (firstIconRect.top + firstIconRect.height / 2) - timelineRect.top;
      const lastIconCenterY = (lastIconRect.top + lastIconRect.height / 2) - timelineRect.top;

      // Set the line to start at center of first icon and end at center of last icon
      // Line will span exactly from center to center, not extending beyond
      const lineTop = firstIconCenterY;
      const lineHeight = lastIconCenterY - firstIconCenterY;

      timeline.style.setProperty('--line-top', `${lineTop}px`);
      timeline.style.setProperty('--line-height', `${Math.max(0, lineHeight)}px`);
    }

    /**
     * Update the timeline progress based on scroll position
     * Progress is calculated based on icon center positions to match line positioning
     */
    function updateTimelineProgress() {
      const timelineRect = timeline.getBoundingClientRect();
      const firstIconRect = firstIcon.getBoundingClientRect();
      const lastIconRect = lastIcon.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Get the center positions of first and last icons
      const firstIconCenter = firstIconRect.top + firstIconRect.height / 2;
      const lastIconCenter = lastIconRect.top + lastIconRect.height / 2;
      
      // The trigger point is when icons pass through viewport center
      const triggerPoint = windowHeight * 0.6;
      
      // Calculate progress based on icon center positions relative to trigger point
      const totalDistance = lastIconCenter - firstIconCenter;
      const progressDistance = triggerPoint - firstIconCenter;
      
      let progress = 0;
      
      if (firstIconCenter >= triggerPoint) {
        // First icon hasn't reached trigger yet
        progress = 0;
      } else if (lastIconCenter <= triggerPoint) {
        // Last icon has passed trigger
        progress = 100;
      } else {
        // Somewhere in between
        progress = Math.max(0, Math.min(100, (progressDistance / totalDistance) * 100));
      }
      
      // Apply the progress via CSS custom property
      timeline.style.setProperty('--timeline-progress', progress);
    }

    /**
     * Combined update function
     */
    function updateTimeline() {
      updateLinePosition();
      updateTimelineProgress();
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateTimelineProgress();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Update line position on resize
    window.addEventListener('resize', function() {
      updateLinePosition();
    });

    // Initial setup
    updateTimeline();
    
    // Re-run after a short delay to ensure layout is complete
    setTimeout(updateTimeline, 100);
    setTimeout(updateTimeline, 500);
  }

  /**
   * Setup back-to-top button functionality
   * Shows button when user scrolls down, hides when at top
   * Smoothly scrolls to top when clicked
   */
  function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;

    /**
     * Scroll threshold to show the button (in pixels from top)
     */
    const scrollThreshold = 300;

    /**
     * Handle scroll event to show/hide back-to-top button
     */
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY > scrollThreshold) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }

    /**
     * Scroll to top smoothly when button is clicked
     */
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Handle button click
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToTop();
    });

    // Check initial scroll position
    handleScroll();
  }

  /**
   * Setup form handling for the email input in CTA section
   * Prevents default form submission and provides user feedback
   */
  function setupFormHandling() {
    const ctaForm = document.querySelector('.cta-form');
    const ctaInput = document.querySelector('.cta-input');
    const ctaButton = ctaForm?.querySelector('.btn-primary');
    
    if (!ctaForm || !ctaInput || !ctaButton) return;
    
    // Handle form submission
    ctaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleEmailSubmission();
    });
    
    // Handle button click
    ctaButton.addEventListener('click', function(e) {
      e.preventDefault();
      handleEmailSubmission();
    });
    
    // Handle Enter key in input
    ctaInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEmailSubmission();
      }
    });
  }

  /**
   * Handle email submission
   * In a real application, this would send the email to a server
   * For now, it just provides user feedback
   */
  function handleEmailSubmission() {
    const ctaInput = document.querySelector('.cta-input');
    const email = ctaInput?.value.trim();
    
    if (!email) {
      // Show error state
      ctaInput.style.borderColor = '#D4183D';
      ctaInput.placeholder = 'Please enter a valid email';
      setTimeout(() => {
        ctaInput.style.borderColor = '#0A0A0A';
        ctaInput.placeholder = 'Enter your email...';
      }, 2000);
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ctaInput.style.borderColor = '#D4183D';
      ctaInput.value = '';
      ctaInput.placeholder = 'Invalid email address';
      setTimeout(() => {
        ctaInput.style.borderColor = '#0A0A0A';
        ctaInput.placeholder = 'Enter your email...';
      }, 2000);
      return;
    }
    
    // Success state (in real app, would send to server)
    console.log('Email submitted:', email);
    ctaInput.value = '';
    ctaInput.placeholder = 'Thanks! Check your email for the demo link.';
    ctaInput.style.borderColor = '#4e9f96';
    
    setTimeout(() => {
      ctaInput.style.borderColor = '#0A0A0A';
      ctaInput.placeholder = 'Enter your email...';
    }, 3000);
  }

  /**
   * Add CSS for scroll-triggered animations
   * These styles will be injected to support the Intersection Observer animations
   * Theme-matching animations: smooth, clean, no glows
   */
  function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Base animation styles - smooth and theme-appropriate */
      [data-animate] {
        opacity: 0;
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: opacity, transform;
      }
      
      /* Fade in animations */
      [data-animate="fade-in"].animate-in {
        opacity: 1 !important;
      }
      
      /* Slide up animations */
      [data-animate="fade-in-up"] {
        transform: translateY(30px);
      }
      
      [data-animate="fade-in-up"].animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      /* Slide down animations */
      [data-animate="fade-in-down"] {
        transform: translateY(-30px);
      }
      
      [data-animate="fade-in-down"].animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      /* Slide left animations */
      [data-animate="fade-in-left"] {
        transform: translateX(-30px);
      }
      
      [data-animate="fade-in-left"].animate-in {
        opacity: 1 !important;
        transform: translateX(0) !important;
      }
      
      /* Slide right animations */
      [data-animate="fade-in-right"] {
        transform: translateX(30px);
      }
      
      [data-animate="fade-in-right"].animate-in {
        opacity: 1 !important;
        transform: translateX(0) !important;
      }
      
      /* Scale animations */
      [data-animate="scale-in"] {
        transform: scale(0.9);
      }
      
      [data-animate="scale-in"].animate-in {
        opacity: 1 !important;
        transform: scale(1) !important;
      }
      
      /* Stagger delay classes for sequential animations */
      [data-animate-delay="100"].animate-in {
        transition-delay: 0.1s;
      }
      
      [data-animate-delay="200"].animate-in {
        transition-delay: 0.2s;
      }
      
      [data-animate-delay="300"].animate-in {
        transition-delay: 0.3s;
      }
      
      [data-animate-delay="400"].animate-in {
        transition-delay: 0.4s;
      }
      
      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        [data-animate] {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Wait for Lottie library to load before initializing
   * Ensures the library is available before trying to load animations
   */
  function waitForLottie(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkInterval = setInterval(function() {
      attempts++;
      if (typeof lottie !== 'undefined') {
        clearInterval(checkInterval);
        callback();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error('Lottie library failed to load after maximum attempts');
        // Initialize other features even if Lottie fails
        callback();
      }
    }, 100);
  }

  // Scroll to top immediately when script loads (before DOM ready)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Also scroll to top before page unloads (ensures fresh start on refresh)
  window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
  });

  // Initialize when DOM is ready and Lottie library is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      injectAnimationStyles();
      waitForLottie(function() {
        init();
      });
    });
  } else {
    injectAnimationStyles();
    waitForLottie(function() {
      init();
    });
  }
})();


