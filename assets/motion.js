(() => {
  const progress = document.querySelector('.scroll-progress');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero-art');
  const heroImage = hero?.querySelector('img');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;

  function updateScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const amount = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
    progress.style.transform = `scaleX(${amount})`;
    header.classList.toggle('is-scrolled', window.scrollY > 18);

    if (heroImage && !reducedMotion.matches && window.innerWidth >= 700) {
      const shift = Math.max(-9, Math.min(9, -hero.getBoundingClientRect().top * 0.035));
      heroImage.style.setProperty('--hero-shift', `${shift}px`);
    } else if (heroImage) {
      heroImage.style.removeProperty('--hero-shift');
    }
    ticking = false;
  }

  function queueScrollUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScroll);
  }

  updateScroll();
  window.addEventListener('scroll', queueScrollUpdate, { passive: true });
  window.addEventListener('resize', queueScrollUpdate, { passive: true });
  window.addEventListener('pageshow', queueScrollUpdate);

  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.intro-inner, #possibilidades .eyebrow, #possibilidades h2, ' +
    '.possibility-card, #trabalhos .eyebrow, #trabalhos h2, ' +
    '.real-work figure, .process-intro, .steps li, ' +
    '.order-intro, .order-form, .faq-grid > div'
  );

  targets.forEach((element, index) => {
    element.dataset.reveal = '';
    if (element.matches('.possibility-card, .real-work figure, .steps li')) {
      element.style.setProperty('--reveal-delay', `${(index % 3) * 75}ms`);
    }
  });

  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -7% 0px', threshold: 0.05 });

  targets.forEach(element => observer.observe(element));
})();
