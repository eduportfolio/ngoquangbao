/* ============================================================
   MAIN.JS — Ngô Quang Bảo Personal Portfolio
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. NAV BURGER (mobile) ─────────────────────────────── */
  const burger   = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on any nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 2. SCROLL-REVEAL ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback — just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── 3. NAVBAR — highlight active section on scroll ──────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav () {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 90) current = sec.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ── 4. NAVBAR — scroll shadow ───────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,.35)'
        : 'none';
    }, { passive: true });
  }

  /* ── 5. SMOOTH ANCHOR with offset for fixed nav ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 6. LIGHTBOX FOR IMAGES ─────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg && lightboxCaption) {
    // Tìm tất cả các ảnh thực tế (loại trừ ảnh của khối placeholder)
    const galleryImages = document.querySelectorAll('img:not(.placeholder-img)');

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;

        // Lấy text caption: Ưu tiên tìm class .img-caption ở gần, nếu không có thì lấy thuộc tính alt
        const siblingCaption = img.parentElement ? img.parentElement.querySelector('.img-caption') : null;
        lightboxCaption.textContent = siblingCaption ? siblingCaption.textContent : img.alt;

        // Hiện lightbox
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Khóa scroll nền
      });
    });

    const closeLightbox = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Mở lại scroll nền
      setTimeout(() => { lightboxImg.src = ''; }, 400); // Reset src khi ẩn xong hẳn
    };

    // Đóng khi click nút Close hoặc click ra ngoài vùng ảnh
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Đóng khi nhấn nút ESC trên bàn phím
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
        closeLightbox();
      }
    });
  }

  /* ── 7. DYNAMIC QUOTES FOR FOOTER ───────────────────────── */
  const quotes = [
    { text: '"The art of medicine consists of amusing the patient while nature cures the disease."', author: "— Voltaire" },
    { text: '"Wherever the art of Medicine is loved, there is also a love of Humanity."', author: "— Hippocrates" },
    { text: '"Science is a beautiful gift to humanity, we should not distort it."', author: "— A. P. J. Abdul Kalam" },
    { text: '"Medicine is a science of uncertainty and an art of probability."', author: "— William Osler" }
  ];

  const quoteEl = document.getElementById('footerQuote');
  const authorEl = document.getElementById('footerQuoteAuthor');

  if (quoteEl && authorEl) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteEl.textContent = quotes[randomIndex].text;
    authorEl.textContent = quotes[randomIndex].author;
  }

  /* ── 7. BACK TO TOP BUTTON ──────────────────────────────── */
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 8. INTERACTIVE HERO CANVAS BACKGROUND ───────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 40; // Số lượng hạt hiển thị (vừa phải để mượt mà)

    // Khởi tạo kích thước canvas full phần hero
    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Đối tượng hạt
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Kích thước hạt từ 1px - 3px
        this.speedX = (Math.random() - 0.5) * 0.3; // Tốc độ trôi ngang chậm cực mượt
        this.speedY = (Math.random() - 0.5) * 0.3; // Tốc độ trôi dọc chậm
        this.opacity = Math.random() * 0.4 + 0.1;  // Độ mờ nhạt để không làm rối mắt
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bật lại khi chạm cạnh
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(79, 195, 247, ${this.opacity})`; // Sử dụng màu --sky gốc của bạn
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Tạo mảng hạt
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Vòng lặp vẽ liên tục
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Vẽ và nối các hạt ở gần nhau (Tạo hiệu ứng mạng lưới dữ liệu / mô vi sinh)
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) { // Khoảng cách tối đa để nối các hạt
            ctx.strokeStyle = `rgba(79, 195, 247, ${(1 - distance / 120) * 0.07})`; // Đường nối mờ tinh tế
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    // Chỉ kích hoạt chạy animation nếu thiết bị không bật chế độ giảm hiệu ứng chuyển động
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animate();
    }
  }

})();
