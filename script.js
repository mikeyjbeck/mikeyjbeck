// ============================================================
//  Portfolio interactions
//  - Scroll progress bar
//  - Top nav appears after hero
//  - Section progress rail (right edge) active tracking
//  - Section reveal-on-scroll (IntersectionObserver)
//  - Magnetic primary CTAs
//  - Mobile menu toggle stub
// ============================================================

(() => {
  const root = document.documentElement;
  const topNav = document.getElementById('top-nav');
  const rail = document.querySelector('.section-rail');
  const railDots = Array.from(document.querySelectorAll('.rail-dot'));
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const heroBottom = () => {
    const h = document.getElementById('hero');
    return h ? h.offsetTop + h.offsetHeight * 0.5 : 600;
  };

  // -------- Scroll progress bar + nav visibility --------
  const onScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(100, (window.scrollY / max) * 100);
    root.style.setProperty('--scroll', pct + '%');

    const past = window.scrollY > heroBottom();
    if (topNav) topNav.classList.toggle('is-visible', past);
    if (rail)   rail.classList.toggle('is-visible',  past);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- Section reveal animations --------
  if ('IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    scenes.forEach((s) => revealIO.observe(s));

    // -------- Section progress rail active tracking --------
    const railIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const id = entry.target.id;
          railDots.forEach((dot) => {
            dot.classList.toggle('is-active', dot.dataset.rail === id);
          });
        }
      });
    }, { threshold: [0.4, 0.6] });
    scenes.forEach((s) => railIO.observe(s));
  }

  // -------- Magnetic primary CTAs --------
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach((el) => {
    const strength = 18;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(x, y);
      const max = Math.max(r.width, r.height);
      const t = Math.min(1, dist / max);
      el.style.transform = `translate(${(x / max) * strength}px, ${(y / max) * strength}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // -------- Mobile menu (stub) --------
  document.querySelectorAll('.menu-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
    });
  });

  // -------- Rotating word in hero tagline --------
  document.querySelectorAll('[data-rotator]').forEach((rotator) => {
    const items = rotator.querySelectorAll('.rotator-item');
    if (items.length < 2) return;
    let i = 0;
    setInterval(() => {
      const current = items[i];
      const next = items[(i + 1) % items.length];
      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      next.classList.remove('is-leaving');
      next.classList.add('is-active');
      setTimeout(() => current.classList.remove('is-leaving'), 700);
      i = (i + 1) % items.length;
    }, 2400);
  });

  // -------- Filter pills (Design Studio) --------
  const project04 = document.getElementById('project-04');
  const pills = document.querySelectorAll('#project-04 .pill');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');
      const filter = pill.dataset.filter;
      if (filter === 'all') {
        project04.removeAttribute('data-filter');
      } else {
        project04.setAttribute('data-filter', filter);
      }
    });
  });

  // -------- Funnel iframe live-preview scaling --------
  // Iframes render at 1280px wide; scale them to whatever the container resolves to.
  const FUNNEL_BASE_WIDTH = 1280;
  const funnelWraps = document.querySelectorAll('[data-funnel-iframe-wrap]');
  if (funnelWraps.length && 'ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const w = entry.contentRect.width;
        if (w > 0) {
          const scale = (w / FUNNEL_BASE_WIDTH).toFixed(3);
          entry.target.style.setProperty('--funnel-scale', scale);
        }
      });
    });
    funnelWraps.forEach((wrap) => {
      ro.observe(wrap);
      const iframe = wrap.querySelector('.funnel-iframe');
      if (iframe) {
        iframe.addEventListener('load', () => {
          // Small delay so the iframe finishes painting before we reveal it
          setTimeout(() => wrap.classList.add('is-ready'), 400);
        });
      }
    });
  }

  // Cursor follower removed for performance — native cursor used instead.
})();
