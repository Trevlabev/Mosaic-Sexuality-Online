(() => {
  const panels = [...document.querySelectorAll('.question-panel')];
  const result = document.querySelector('.result-panel');
  const progress = document.querySelector('.progress-fill');
  const progressText = document.querySelector('[data-progress-text]');
  const navButtons = [...document.querySelectorAll('.assessment-nav button')];
  if (!panels.length) return;

  let index = 0;
  const answers = {};

  function updateProgress() {
    const completed = Object.keys(answers).length;
    const pct = Math.round((completed / panels.length) * 100);
    if (progress) progress.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${completed} of ${panels.length} dimensions explored`;
  }

  function showPanel(next) {
    index = Math.max(0, Math.min(next, panels.length - 1));
    panels.forEach((panel, i) => panel.classList.toggle('active', i === index));
    result?.classList.remove('active');
    navButtons.forEach((b, i) => b.classList.toggle('active', i === index));
    document.querySelector('.assessment-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function collect(panel) {
    const key = panel.dataset.key;
    const checked = panel.querySelector('input[type="radio"]:checked');
    const range = panel.querySelector('input[type="range"]');
    answers[key] = checked ? checked.value : range ? range.value : 'Not answered';
    updateProgress();
  }

  function buildResult() {
    const map = {
      identity: ['Identity centrality', answers.identity],
      attraction: ['Attraction pattern', answers.attraction],
      romance: ['Romantic pattern', answers.romance],
      history: ['History–present relationship', answers.history],
      structure: ['Relationship orientation', answers.structure],
      context: ['Context sensitivity', `${answers.context}/100`]
    };
    const list = document.querySelector('[data-result-list]');
    if (list) {
      list.innerHTML = Object.values(map).map(([label, value]) => `
        <div class="result-item"><strong>${label}</strong><span>${value || 'Not answered'}</span></div>
      `).join('');
    }
    const narrative = document.querySelector('[data-result-narrative]');
    if (narrative) {
      narrative.textContent = 'Your preview demonstrates why MOSAIC avoids collapsing sexuality into a single category. Identity, attraction, romantic experience, history, current conduct, relationship orientation, and context can align, diverge, or change independently. A full assessment would preserve those distinctions and report them as a profile rather than a verdict.';
    }
    panels.forEach(p => p.classList.remove('active'));
    result?.classList.add('active');
    navButtons.forEach(b => b.classList.remove('active'));
    if (progress) progress.style.width = '100%';
    if (progressText) progressText.textContent = 'Preview complete';
  }

  panels.forEach((panel, i) => {
    panel.querySelector('[data-next]')?.addEventListener('click', () => {
      collect(panel);
      if (i === panels.length - 1) buildResult(); else showPanel(i + 1);
    });
    panel.querySelector('[data-prev]')?.addEventListener('click', () => showPanel(i - 1));
  });

  navButtons.forEach((button, i) => button.addEventListener('click', () => showPanel(i)));
  document.querySelector('[data-restart]')?.addEventListener('click', () => {
    Object.keys(answers).forEach(k => delete answers[k]);
    document.querySelectorAll('input[type="radio"]').forEach(i => { i.checked = false; });
    document.querySelectorAll('input[type="range"]').forEach(i => { i.value = i.defaultValue; i.dispatchEvent(new Event('input')); });
    updateProgress();
    showPanel(0);
  });

  document.querySelectorAll('.big-range input').forEach(input => {
    const output = document.querySelector(`[data-big-range-output="${input.id}"]`);
    const update = () => { if (output) output.textContent = input.value; };
    input.addEventListener('input', update);
    update();
  });

  showPanel(0);
  updateProgress();
})();
