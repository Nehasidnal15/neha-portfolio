/**
 * Neha M. Sidnal - Premium Portfolio Script
 * Features: Multi-Photo Project Sliders, Cert Lightbox Modal, Filter engine, Typing engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Init features
  initThemeToggle();
  initNavbar();
  initTypingEffect();
  initProjectSliders();
  initCertificateLightbox();
  initProjectFilters();
  initScrollAnimations();
  initContactInteractions();
});

/* ==========================================================================
   1. Navbar & Header Interactions
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  // Sticky Scroll Class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Hamburger Toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close Menu on Link Clicks
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Active Nav Item on Scroll (ScrollSpy)
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 150; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   2. Typing Effect (Hero Banner)
   ========================================================================== */
function initTypingEffect() {
  const typingSpan = document.querySelector('.hero-subtitle span');
  if (!typingSpan) return;

  const words = ['MCA Student', 'Software Developer', 'Machine Learning Enthusiast', 'Full Stack Developer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster delete
    } else {
      typingSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // standard typing
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1500; // wait before delete
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // wait before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Multi-Photo Project Sliders
   ========================================================================== */
function initProjectSliders() {
  const sliders = document.querySelectorAll('.project-slider');
  
  sliders.forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.slider-btn.prev');
    const nextBtn = slider.querySelector('.slider-btn.next');
    const dotsContainer = slider.querySelector('.slider-dots');
    
    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return; // No slider needed
    }

    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 3000; // Auto-slide interval of 3 seconds (3000ms)

    // Create Indicator Dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

    function updateDots() {
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      if (currentIndex < 0) {
        currentIndex = slides.length - 1;
      } else if (currentIndex >= slides.length) {
        currentIndex = 0;
      }
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    // Auto-Slide Controls
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, slideDuration);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    }

    // Initialize Auto-Slide
    startAutoSlide();

    // Desktop hover play/pause support
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Prev / Next Listeners
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentIndex + 1);
    });

    // Touch Support / Swiping (Mobile play/pause support)
    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
      stopAutoSlide();
      startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
      startAutoSlide();
    }, { passive: true });

    function handleSwipe() {
      const diff = startX - endX;
      const threshold = 50; // min swipe distance
      if (diff > threshold) {
        goToSlide(currentIndex + 1); // Swipe Left -> Next
      } else if (diff < -threshold) {
        goToSlide(currentIndex - 1); // Swipe Right -> Prev
      }
    }
  });
}

/* ==========================================================================
   4. Visual Certificates Lightbox Modal
   ========================================================================== */
function initCertificateLightbox() {
  const certCards = Array.from(document.querySelectorAll('.cert-card'));
  const lightbox = document.getElementById('cert-lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-nav-btn.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav-btn.next');
  const caption = lightbox.querySelector('.lightbox-caption');

  let activeIndex = 0;

  function openLightbox(index) {
    activeIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scroll
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const activeCard = certCards[activeIndex];
    const imageSrc = activeCard.getAttribute('data-cert-src');
    const title = activeCard.getAttribute('data-cert-title') || 'Certificate';
    
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
      lightboxImg.src = imageSrc;
      caption.textContent = title;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  function nextCert() {
    activeIndex = (activeIndex + 1) % certCards.length;
    updateLightboxContent();
  }

  function prevCert() {
    activeIndex = (activeIndex - 1 + certCards.length) % certCards.length;
    updateLightboxContent();
  }

  // Event Listeners
  certCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevCert();
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextCert();
  });

  // Click Outside to Close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-image-container')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextCert();
    if (e.key === 'ArrowLeft') prevCert();
  });
}

/* ==========================================================================
   5. Dynamic Project Category Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active Button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Set transition initial
        card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        
        if (filterValue === 'all' || card.classList.contains(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Intersection Observer Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

/* ==========================================================================
   7. Contact Interactions (Copied toast & simulated Form)
   ========================================================================== */
function initContactInteractions() {
  const toast = document.getElementById('clipboard-toast');
  const toastMsg = toast ? toast.querySelector('.toast-message') : null;
  const copyElements = document.querySelectorAll('[data-copy]');

  // Copied toast trigger
  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyElements.forEach(elem => {
    elem.addEventListener('click', () => {
      const textToCopy = elem.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          const label = elem.querySelector('h4').textContent;
          showToast(`${label.charAt(0) + label.slice(1).toLowerCase()} copied to clipboard!`);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    });
  });

  // Glass Form Integration with FormSubmit
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnHtml = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Message...</span>`;
      
      const formData = {
        name: contactForm.querySelector('#name').value,
        email: contactForm.querySelector('#email').value,
        message: contactForm.querySelector('#message').value
      };
      
      // Submit via FormSubmit AJAX API
      fetch('https://formsubmit.co/ajax/nehasidnal15.mca@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          submitBtn.innerHTML = `<span>✓ Message Sent!</span>`;
          submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          showToast('Message sent successfully! Neha will get in touch soon.');
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        submitBtn.innerHTML = `<span>Error Sending!</span>`;
        submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        showToast('Failed to send message. Please copy my email directly.');
      })
      .finally(() => {
        // Reset button
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          submitBtn.style.background = '';
        }, 4000);
      });
    });
  }
}

/* ==========================================================================
   8. Theme Toggling Control (Light/Dark Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  const toggleIcon = toggleBtn.querySelector('i');
  
  // Check persisted or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Default is dark unless light is explicitly saved or system prefers light
  let currentTheme = 'dark';
  if (savedTheme) {
    currentTheme = savedTheme;
  } else if (!systemPrefersDark) {
    currentTheme = 'light';
  }
  
  // Apply initial theme
  setTheme(currentTheme);
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    
    // Toggle Icon
    if (theme === 'light') {
      toggleIcon.className = 'fa-solid fa-sun';
      toggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      toggleIcon.className = 'fa-solid fa-moon';
      toggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }
  
  toggleBtn.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Smooth transition effect
    document.documentElement.classList.add('theme-transition');
    setTheme(nextTheme);
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 400);
  });
}
