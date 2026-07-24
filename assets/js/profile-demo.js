(() => {
  const chart = document.querySelector('[data-profile-polygon]');
  const summary = document.querySelector('[data-profile-summary]');
  const inputs = [...document.querySelectorAll('[data-profile-input]')];
  if (!chart || !inputs.length) return;

  const cx = 160, cy = 160, maxR = 118;
  const labels = ['Identity', 'Attraction', 'Romance', 'History', 'Conduct', 'Context'];

  function point(index, value) {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / inputs.length);
    const radius = maxR * (Number(value) / 100);
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }

  function render() {
    const values = inputs.map(i => Number(i.value));
    chart.setAttribute('points', values.map((v, i) => point(i, v)).join(' '));
    const high = values.map((v, i) => ({ v, label: labels[i] })).sort((a,b) => b.v - a.v).slice(0,2);
    const low = values.map((v, i) => ({ v, label: labels[i] })).sort((a,b) => a.v - b.v)[0];
    if (summary) {
      summary.textContent = `This illustrative profile is most pronounced in ${high[0].label.toLowerCase()} and ${high[1].label.toLowerCase()}, with ${low.label.toLowerCase()} represented as a more peripheral dimension. MOSAIC treats this pattern as descriptive—not as a hierarchy or diagnosis.`;
    }
  }

  inputs.forEach(i => i.addEventListener('input', render));
  render();
})();
