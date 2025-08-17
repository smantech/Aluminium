/**
 * =============================================
 *            WEBSITE CORE FUNCTIONALITY
 * =============================================
 * This script handles:
 * - Mobile responsive menu with hamburger
 * - Active navigation on scroll (desktop + mobile)
 * - Video player with controls
 * - Gallery carousels
 * - WhatsApp integration
 * - Form handling
 * - Smooth scrolling
 */

// ===== CONSTANTS =====
const PHONE_NUMBER = '+2349036320387';
const STATES_DB = {
  Nigeria: ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Delta", "Ogun", "Enugu"],
  Ghana: ["Greater Accra", "Ashanti", "Western", "Central", "Volta"],
  "South Africa": ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape"]
};

// ===== DOM ELEMENTS =====
const elements = {
  year: document.getElementById('year'),
  modal: document.getElementById('modal'),
  modalImg: document.querySelector('#modal img'),
  whatsappBtn: document.getElementById('whatsappBtn'),
  sendWhatsBtn: document.getElementById('sendWhats'),
  quoteForm: document.getElementById('quoteForm'),
  imageInput: document.getElementById('image'),
  countrySelect: document.getElementById('country'),
  stateSelect: document.getElementById('state'),
  zoomModal: document.getElementById('zoomModal'),
  zoomClose: document.querySelector('.zoom-close'),
  zoomContent: document.getElementById('zoomImg'),
  zoomVideo: document.getElementById('zoomVideo'),
  hamburger: document.querySelector('.hamburger'),
  mobileMenu: document.querySelector('.mobile-menu'),
  navLinks: document.querySelectorAll('.nav-link')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  if (elements.year) elements.year.textContent = new Date().getFullYear();
  
  // Initialize all components
  initMobileMenu();
  initScrollSpy(); // Active nav tracking
  initCarousels();
  initLocationSelectors();
  initSmoothScrolling();
  initModals();
  initWhatsAppButtons();
  initVideoPlayer();
});

// ===== ACTIVE NAVIGATION ON SCROLL =====
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  
  if (!sections.length || !elements.navLinks.length) return;

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 200; // Adjust offset as needed
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        elements.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  if (!elements.hamburger || !elements.mobileMenu) return;
  
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpening = !elements.hamburger.classList.contains('active');
    elements.hamburger.classList.toggle('active');
    elements.mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isOpening ? 'hidden' : '';
    elements.hamburger.setAttribute('aria-expanded', isOpening);
    
    if (isOpening) {
      document.querySelectorAll('video').forEach(v => v.pause());
    }
  }

  elements.hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    if (!link.id.includes('Whatsapp')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
        const target = document.querySelector(link.getAttribute('href'));
        target && setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
      });
    }
  });

  [elements.whatsappBtn, document.getElementById('mobileWhatsappBtn')].forEach(btn => {
    btn?.addEventListener('click', function(e) {
      if (this.id === 'mobileWhatsappBtn') e.preventDefault();
      openWhatsApp('Hello, I need information about your services');
      if (this.id === 'mobileWhatsappBtn') toggleMenu();
    });
  });
}

// ===== VIDEO PLAYER =====
function initVideoPlayer() {
  const mediaItem = document.querySelector('.media-item');
  if (!mediaItem) return;

  const video = mediaItem.querySelector('video');
  const playIcon = mediaItem.querySelector('.play-icon');
  const playBtn = mediaItem.querySelector('.play-btn');
  const soundBtn = mediaItem.querySelector('.sound-btn');
  const timeDisplay = mediaItem.querySelector('.time');

  if (!video) return;

  let isVideoPlaying = false;
  video.muted = true;
  video.playsInline = true;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateTime() {
    if (timeDisplay) timeDisplay.textContent = formatTime(video.currentTime);
  }

  function togglePlayback() {
    if (video.paused) {
      document.querySelectorAll('video').forEach(v => v !== video && v.pause());
      video.play()
        .then(() => {
          isVideoPlaying = true;
          video.muted = false;
          if (soundBtn) soundBtn.textContent = '🔊';
        })
        .catch(console.error);
    } else {
      isVideoPlaying = false;
      video.pause();
    }
  }

  if (playIcon) playIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayback();
  });

  if (playBtn) playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayback();
  });

  if (soundBtn) soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? '🔇' : '🔊';
  });

  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('loadedmetadata', updateTime);
  video.addEventListener('play', () => {
    if (playBtn) playBtn.textContent = '❚❚';
    if (playIcon) playIcon.style.display = 'none';
  });
  video.addEventListener('pause', () => {
    if (playBtn) playBtn.textContent = '▶';
    if (playIcon) playIcon.style.display = 'flex';
  });
  mediaItem.addEventListener('click', togglePlayback);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isVideoPlaying) video.pause();
  });
}

// ===== CORE FUNCTIONS =====
function openWhatsApp(message) {
  window.open(`https://wa.me/${PHONE_NUMBER.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`, '_blank');
}

function prefill(service) {
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) serviceSelect.value = service;
  document.getElementById('desc')?.focus();
  
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    setTimeout(() => contactSection.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}

// ===== CAROUSELS =====
function initCarousels() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setupCarousel(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-carousel').forEach(carousel => {
    observer.observe(carousel);
  });
}

function setupCarousel(carousel) {
  const slide = carousel.querySelector('.carousel-slide');
  if (!slide) return;
  
  const images = carousel.querySelectorAll('img');
  const [prevBtn, nextBtn] = ['.prev', '.next'].map(s => carousel.querySelector(s));
  let currentIndex = 0, autoScrollTimeout, isScrolling = false;

  if (images.length) images[0].style.opacity = '1';

  function startAutoScroll() {
    clearTimeout(autoScrollTimeout);
    !isScrolling && (autoScrollTimeout = setTimeout(() => {
      nextImage();
      startAutoScroll();
    }, 4000));
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
  }

  function updateCarousel() {
    images.forEach(img => img.style.opacity = '0');
    images[currentIndex].style.opacity = '1';
    slide.scrollTo({ left: images[currentIndex].offsetLeft, behavior: 'smooth' });
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    clearTimeout(autoScrollTimeout);
    nextImage();
    startAutoScroll();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    clearTimeout(autoScrollTimeout);
    prevImage();
    startAutoScroll();
  });

  carousel.addEventListener('mouseenter', () => {
    isScrolling = true;
    clearTimeout(autoScrollTimeout);
  });

  carousel.addEventListener('mouseleave', () => {
    isScrolling = false;
    startAutoScroll();
  });

  let startX;
  slide.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    clearTimeout(autoScrollTimeout);
  }, { passive: true });

  slide.addEventListener('touchend', (e) => {
    const diffX = startX - e.changedTouches[0].pageX;
    Math.abs(diffX) > 50 && (diffX > 0 ? nextImage() : prevImage());
    startAutoScroll();
  });

  images.forEach(img => {
    img.addEventListener('click', () => {
      if (elements.zoomContent) {
        elements.zoomContent.src = img.src;
        elements.zoomContent.alt = img.alt;
      }
      if (elements.zoomModal) elements.zoomModal.style.display = "block";
    });
  });

  startAutoScroll();
}

// ===== OTHER COMPONENTS =====
function initLocationSelectors() {
  if (!elements.countrySelect || !elements.stateSelect) return;

  elements.countrySelect.addEventListener('change', function() {
    const country = this.value;
    elements.stateSelect.innerHTML = '<option value="" disabled selected>Select State</option>';
    
    STATES_DB[country]?.forEach(state => {
      elements.stateSelect.add(new Option(state, state));
    });
  });
  
  if (elements.countrySelect.value === 'Nigeria') {
    elements.countrySelect.dispatchEvent(new Event('change'));
  }
}

function initSmoothScrolling() {
  let isScrolling = false;
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (isScrolling) return;
      isScrolling = true;
      
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => { isScrolling = false; }, 1000);
      }
    });
  });
}

function initModals() {
  if (elements.modal) {
    elements.modal.addEventListener('click', (e) => {
      if (e.target === elements.modal) elements.modal.classList.remove('open');
    });
  }

  if (elements.imageInput && elements.modalImg) {
    elements.imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      elements.modalImg.src = URL.createObjectURL(file);
      elements.modal?.classList.add('open');
    });
  }

  if (elements.zoomClose) elements.zoomClose.addEventListener('click', closeZoomModal);
  if (elements.zoomModal) {
    elements.zoomModal.addEventListener('click', function(e) {
      if (e.target === elements.zoomModal) closeZoomModal();
    });
  }
}

function closeZoomModal() {
  if (elements.zoomModal) elements.zoomModal.style.display = "none";
  if (elements.zoomVideo) {
    elements.zoomVideo.pause();
    elements.zoomVideo.currentTime = 0;
    elements.zoomVideo.style.display = "none";
  }
  if (elements.zoomContent) elements.zoomContent.style.display = "block";
}

function initWhatsAppButtons() {
  if (elements.whatsappBtn) {
    elements.whatsappBtn.addEventListener('click', () => {
      openWhatsApp('Hello, I would like a quote for aluminium windows & doors.');
    });
  }

  if (elements.sendWhatsBtn) {
    elements.sendWhatsBtn.addEventListener('click', () => {
      const formData = {
        name: document.getElementById('name')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        country: document.getElementById('country')?.value || '',
        state: document.getElementById('state')?.value || '',
        service: document.getElementById('service')?.value || '',
        desc: document.getElementById('desc')?.value || ''
      };
      const message = `Hello! My name is ${formData.name}.\n\nI need: ${formData.service}\nLocation: ${formData.state}, ${formData.country}\nPhone: ${formData.phone}\n\nDetails:\n${formData.desc}`;
      openWhatsApp(message);
    });
  }
}

// Form handling
if (elements.quoteForm) {
  elements.quoteForm.addEventListener('submit', function(e) {
    if (!elements.stateSelect?.value) {
      e.preventDefault();
      alert("Please select your state/region");
      elements.stateSelect?.focus();
      return;
    }
    
    const phone = document.getElementById('phone')?.value.trim();
    if (!phone || phone.length < 7) {
      e.preventDefault();
      alert('Please enter a valid phone number.');
      return;
    }
    
    alert('Thank you! Your request has been submitted. We will contact you soon.');
  });
}