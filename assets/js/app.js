(() => {
  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];

  const toggle = qs('.nav-toggle');
  const nav = qs('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    qsa('a', nav).forEach(link => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      }
    });
  }

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  qsa('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('visible'));

  qsa('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  qsa('[data-scroll]').forEach(button => {
    button.addEventListener('click', () => {
      const target = qs(button.dataset.scroll);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const explorer = qs('[data-explorer]');
  if (explorer) {
    const tabs = qsa('[data-explorer-tab]', explorer);
    const title = qs('[data-explorer-title]', explorer);
    const body = qs('[data-explorer-body]', explorer);
    const chips = qs('[data-explorer-chips]', explorer);
    const visual = qs('[data-explorer-visual]', explorer);
    const dataScript = qs('script[type="application/json"][data-explorer-data]', explorer);
    const data = dataScript ? JSON.parse(dataScript.textContent) : {};

    const render = key => {
      const item = data[key];
      if (!item) return;
      tabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.explorerTab === key)));
      title.textContent = item.title;
      body.textContent = item.body;
      chips.innerHTML = (item.chips || []).map(c => `<span class="chip accent">${escapeHtml(c)}</span>`).join('');
      visual.innerHTML = item.svg;
    };

    tabs.forEach(tab => tab.addEventListener('click', () => render(tab.dataset.explorerTab)));
    if (tabs[0]) render(tabs[0].dataset.explorerTab);
  }

  const rangeInputs = qsa('[data-live-range]');
  if (rangeInputs.length) {
    rangeInputs.forEach(input => {
      const output = qs(`[data-range-output="${input.id}"]`);
      const update = () => {
        if (output) output.textContent = input.value;
        document.dispatchEvent(new CustomEvent('mosaic:range-change'));
      };
      input.addEventListener('input', update);
      update();
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
