/* ═══════════════════════════════════════
   মেইন জাভাস্ক্রিপ্ট — রক্তস্নাত জুলাই
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── ফোল্ডার থেকে ইমেজ লিস্ট (Dynamically built at load) ─── */
  const IMG_FOLDER = 'Myrt (263+)';

  /* ─── দিন গণনা (July 16, 2024 থেকে আজ পর্যন্ত) ─── */
  function calculateDays() {
    const start = new Date(2024, 6, 16); // জুলাই ১৬, ২০২৪
    const today = new Date();
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    return diff;
  }

  /* ─── বাংলা সংখ্যায় রূপান্তর ─── */
  function toBanglaNum(num) {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, d => banglaDigits[parseInt(d)]);
  }

  /* ─── পার্টিকেল ইফেক্ট — রক্তবিন্দু ─── */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
        color: Math.random() > 0.7
          ? `rgba(196, 30, 58, `     // লাল
          : `rgba(212, 168, 83, `    // সোনালি
      });
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ─── IntersectionObserver — স্ক্রল রিভিল ─── */
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ─── নেভ বার স্ক্রল ইফেক্ট ─── */
  function initNavScroll() {
    const nav = document.querySelector('.nav-bar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ─── স্ক্রল-টু-টপ বাটন ─── */
  function initScrollTop() {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── হিরো মোজাইক ব্যাকগ্রাউন্ড তৈরি ─── */
  function buildHeroMosaic(imageFiles) {
    const mosaic = document.querySelector('.hero-mosaic');
    if (!mosaic) return;
    const shuffled = [...imageFiles].sort(() => Math.random() - 0.5);
    const count = Math.min(72, shuffled.length);
    for (let i = 0; i < count; i++) {
      const img = document.createElement('img');
      img.src = `${IMG_FOLDER}/${shuffled[i]}`;
      img.alt = '';
      img.loading = 'eager';
      img.decoding = 'async';
      mosaic.appendChild(img);
    }
  }

  /* ─── গ্যালারি গ্রিড তৈরি ─── */
  let allImages = [];
  let displayedCount = 0;
  const BATCH_SIZE = 60;

  function buildGalleryBatch() {
    const grid = document.querySelector('.gallery-grid');
    const loadBtn = document.querySelector('.load-more-btn');
    if (!grid) return;

    const end = Math.min(displayedCount + BATCH_SIZE, allImages.length);

    for (let i = displayedCount; i < end; i++) {
      const card = document.createElement('div');
      card.className = 'martyr-card';
      card.dataset.index = i;
      card.style.setProperty('--i', i % 6);
      card.style.transitionDelay = `${(i - displayedCount) * 15}ms`;

      card.innerHTML = `
        <div class="martyr-card-inner">
          <img
            alt="শহীদ ${i + 1}"
            loading="lazy"
            decoding="async"
            class="martyr-portrait"
            src="${IMG_FOLDER}/${allImages[i]}"
          >
          <div class="martyr-card-overlay">
            <span class="martyr-num">${String(i + 1).padStart(3, '0')}</span>
          </div>
        </div>
      `;

      grid.appendChild(card);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add('visible');
        });
      });

      card.addEventListener('click', () => openLightbox(i));
    }

    displayedCount = end;

    if (displayedCount >= allImages.length && loadBtn) {
      loadBtn.style.display = 'none';
    }
  }

  /* ─── লাইটবক্স ─── */
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;
    const lb = document.querySelector('.lightbox');
    const img = lb.querySelector('.lightbox-img');
    const counter = lb.querySelector('.lightbox-counter');

    img.src = `${IMG_FOLDER}/${allImages[index]}`;
    counter.textContent = `${index + 1} / ${allImages.length}`;

    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lb = document.querySelector('.lightbox');
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    currentLightboxIndex += dir;
    if (currentLightboxIndex < 0) currentLightboxIndex = allImages.length - 1;
    if (currentLightboxIndex >= allImages.length) currentLightboxIndex = 0;

    const lb = document.querySelector('.lightbox');
    const img = lb.querySelector('.lightbox-img');
    const counter = lb.querySelector('.lightbox-counter');

    img.src = `${IMG_FOLDER}/${allImages[currentLightboxIndex]}`;
    counter.textContent = `${currentLightboxIndex + 1} / ${allImages.length}`;
  }

  function initLightbox() {
    const lb = document.querySelector('.lightbox');
    if (!lb) return;

    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    lb.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  /* ─── সার্চ ফিল্টার ─── */
  function initSearch() {
    const input = document.getElementById('gallery-search');
    if (!input) return;

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      const cards = document.querySelectorAll('.martyr-card');
      cards.forEach(card => {
        const num = card.querySelector('.martyr-num').textContent;
        card.style.display = num.includes(query) || query === '' ? '' : 'none';
      });
    });
  }

  /* ─── স্লোগান ক্যারোসল ─── */
  function initQuotesCarousel() {
    const slides = document.querySelectorAll('.quote-slide');
    const dotsContainer = document.querySelector('.quote-dots');
    if (slides.length === 0 || !dotsContainer) return;

    let currentIndex = 0;
    let timer = null;

    // ডট তৈরি
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `quote-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Quote ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.quote-dot');

    function goToSlide(index) {
      slides[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');

      currentIndex = index;

      slides[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
      let next = currentIndex + 1;
      if (next >= slides.length) next = 0;
      goToSlide(next);
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 5000); // প্রতি ৫ সেকেন্ডে স্লাইড পরিবর্তন
    }

    resetTimer();
  }

  /* ─── স্মৃতি-কার্ড জেনারেটর ─── */
  function initTributeGenerator() {
    const generateBtn = document.querySelector('.tribute-btn-primary');
    const downloadBtn = document.querySelector('.tribute-btn-secondary');
    const nameInput = document.getElementById('tribute-name');
    const msgSelect = document.getElementById('tribute-msg');
    const canvas = document.querySelector('.tribute-canvas');
    const placeholder = document.querySelector('.tribute-canvas-placeholder');
    const captionBtns = document.querySelectorAll('.tribute-caption-btn');

    if (!generateBtn || !canvas) return;

    const ctx = canvas.getContext('2d');

    // রেডিমেড ক্যাপশন কপি
    const captions = [
      "শহীদদের জন্য দোয়া রইল। আল্লাহ তাঁদের জান্নাতুল ফেরদাউস নসিব করুন। #JulyUprising #Bangladesh",
      "আমরা ভুলবো না। আমরা থামবো না। শহীদের রক্ত বৃথা যেতে দেবো না। #JulyRevolution",
      "তাঁদের রক্তের ঋণ — কখনো ভুলবো না। নতুন বাংলাদেশ গড়বো আমরাই। #MartyrsOfJuly"
    ];

    captionBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(captions[index]).then(() => {
          const iconEl = btn.querySelector('.tribute-caption-icon');
          const originalText = iconEl.textContent;
          iconEl.textContent = 'কপি হয়েছে!';
          setTimeout(() => {
            iconEl.textContent = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      });
    });

    // টেক্সট র‍্যাপ ফাংশন
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      let currentY = y;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line.trim(), x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line.trim(), x, currentY);
    }

    generateBtn.addEventListener('click', () => {
      // প্লেসহোল্ডার হাইড ও ক্যানভাস শো
      if (placeholder) {
        placeholder.style.opacity = '0';
        setTimeout(() => { placeholder.style.display = 'none'; }, 300);
      }
      canvas.style.display = 'block';
      setTimeout(() => { canvas.style.opacity = '1'; }, 50);

      const width = canvas.width;
      const height = canvas.height;

      // ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#100016'); // কালচে বেগুনি
      grad.addColorStop(1, '#050008'); // কুচকুচে কালো
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // ব্যাকগ্রাউন্ডের লাল ফ্লোটিং ডটস
      ctx.fillStyle = 'rgba(196, 30, 58, 0.4)';
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 4 + 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // সোনালি ডটস
      ctx.fillStyle = 'rgba(212, 168, 83, 0.3)';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // বর্ডার
      ctx.strokeStyle = 'rgba(196, 30, 58, 0.6)';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = 'rgba(212, 168, 83, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, width - 110, height - 110);

      // উপরে লাল লোগো/বিন্দু
      ctx.beginPath();
      ctx.arc(width / 2, 130, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#C41E3A';
      ctx.shadowColor = '#C41E3A';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0; // রিসেট শ্যাডো

      // টাইটেল
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F0E6D3';
      ctx.font = 'bold 52px "Tiro Bangla", serif';
      ctx.fillText('রক্তস্নাত জুলাই', width / 2, 230);

      ctx.fillStyle = '#a89a8a';
      ctx.font = '28px "Noto Sans Bengali", sans-serif';
      ctx.fillText('শহীদ স্মৃতিশালা', width / 2, 280);

      // বার্তা রিড করা
      const msgText = msgSelect.options[msgSelect.selectedIndex].text;
      ctx.fillStyle = '#F0E6D3';
      ctx.font = 'bold 62px "Tiro Bangla", serif';
      wrapText(ctx, "“" + msgText + "”", width / 2, 470, width - 200, 95);

      // নাম রিড করা
      const nameText = nameInput.value.trim();
      if (nameText) {
        ctx.fillStyle = '#C41E3A';
        ctx.font = '32px "Noto Sans Bengali", sans-serif';
        ctx.fillText('শ্রদ্ধাঞ্জলিতে:', width / 2, height - 210);

        ctx.fillStyle = '#F0E6D3';
        ctx.font = 'bold 55px "Tiro Bangla", serif';
        ctx.fillText(nameText, width / 2, height - 140);
      }

      // ব্র্যান্ডিং
      ctx.fillStyle = 'rgba(240, 230, 211, 0.45)';
      ctx.font = '24px "Noto Sans Bengali", sans-serif';
      ctx.fillText('জুলাই ২০২৪ · ছাত্র-জনতার অভ্যুত্থান', width / 2, height - 60);

      // ডাউনলোড বাটন এনেবল করা
      downloadBtn.removeAttribute('disabled');
      downloadBtn.style.opacity = '1';
      downloadBtn.style.cursor = 'pointer';
    });

    downloadBtn.addEventListener('click', () => {
      if (downloadBtn.hasAttribute('disabled')) return;
      const link = document.createElement('a');
      link.download = 'july-memorial-tribute-card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  /* ─── ইমেজ ফাইল লিস্ট জেনারেট ─── */
  function getImageList() {
    return [
      "Dignified_2D_graphic_novel_illus\u2026_202605021034.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021034_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021034_11.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021034_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021034_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021034_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021046_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021046_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021046_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021046_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021053.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021053_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021053_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021053_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021053_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021057.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021057_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021057_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021057_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021057_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021057_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021103.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021103_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021103_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021103_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021103_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021106.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021106_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021106_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021106_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021106_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021106_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021110.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021110_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021110_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021110_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021110_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021110_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021114.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021114_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021114_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021114_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021114_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021114_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021117.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021117_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021117_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021117_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021117_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021117_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021121.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021121_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021121_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021121_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021121_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021121_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021127.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021127_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021127_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021127_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021127_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021127_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021131.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021131_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021131_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021138.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021138_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021138_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021138_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021138_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021138_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021142.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021142_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021142_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021142_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021142_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_11.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_12.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_13.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_15.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_16.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_8.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021148_9.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021153.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021153_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021153_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021153_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021153_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021200.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021200_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021200_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021200_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021200_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021200_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021206.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021206_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021206_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021206_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021206_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021210.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021210_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021210_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021210_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021210_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021210_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021214.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021214_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021214_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021214_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021214_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021214_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021217.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021217_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021217_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021217_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021217_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_11.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_8.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021220_9.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021224.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021224_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021224_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021224_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021224_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021224_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021226.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021226_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021226_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021226_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021226_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021226_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021229.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021229_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021229_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021229_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021229_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021229_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021232.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021233.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021234.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021239.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021239_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021239_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021239_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021243.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021243_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021243_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021243_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021243_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021243_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021258.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021258_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021258_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021258_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021258_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021258_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_11.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_12.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_13.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_14.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_8.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021301_9.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_11.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_12.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_13.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_14.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_15.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_16.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_17.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_8.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021310_9.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_12.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_13.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_8.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021321_9.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_11.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_12.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_13.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_14.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_15.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_16.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021328_8.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_11.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_12.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_13.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_14.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_16.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_17.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_18.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_19.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_8.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021342_9.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_10.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_11.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_12.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_13.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_14.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_15.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_16.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_17.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_18.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_19.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_2.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_3.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_4.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_5.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_6.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_7.jpeg",
      "Dignified_2D_graphic_novel_illus\u2026_202605021556_9.jpeg"
    ];
  }

  /* ─── ইনিশিয়ালাইজ সবকিছু ─── */
  document.addEventListener('DOMContentLoaded', () => {
    allImages = getImageList();

    const dayEl = document.getElementById('day-count');
    if (dayEl) {
      const days = calculateDays();
      dayEl.textContent = toBanglaNum(days) + 'তম দিন — তবুও আমরা ভুলিনি';
    }

    buildHeroMosaic(allImages);
    buildGalleryBatch();
    initParticles();
    initReveal();
    initNavScroll();
    initScrollTop();
    initLightbox();
    initSearch();
    initQuotesCarousel();
    initTributeGenerator();

    const loadBtn = document.querySelector('.load-more-btn');
    if (loadBtn) {
      loadBtn.addEventListener('click', buildGalleryBatch);
    }
  });
})();
