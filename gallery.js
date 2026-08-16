(() => {
  const items = [...document.querySelectorAll('.gallery-item')];
  const dialog = document.querySelector('#gallery-dialog');
  const image = document.querySelector('#gallery-dialog-image');
  const caption = document.querySelector('#gallery-dialog-caption');
  const close = document.querySelector('.gallery-close');
  const previous = document.querySelector('[data-gallery-prev]');
  const next = document.querySelector('[data-gallery-next]');
  let current = 0;

  const render = (index) => {
    current = (index + items.length) % items.length;
    const source = items[current].querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    caption.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  };

  const open = (index) => {
    render(index);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  items.forEach((item, index) => item.addEventListener('click', () => open(index)));
  previous.addEventListener('click', () => render(current - 1));
  next.addEventListener('click', () => render(current + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') render(current - 1);
    if (event.key === 'ArrowRight') render(current + 1);
    if (event.key === 'Escape') dialog.close();
  });
})();