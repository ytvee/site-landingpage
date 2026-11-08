import EmblaCarousel from 'embla-carousel';

export function initSlider(): void {
  const root = document.querySelector<HTMLElement>('[data-slider]');
  const viewport = root?.querySelector<HTMLElement>('[data-viewport]');
  if (!root || !viewport) return;
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const total = root.querySelector<HTMLElement>('[data-total]')!;
  const current = root.querySelector<HTMLElement>('[data-current]')!;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const embla = EmblaCarousel(viewport, {
    align: 'start',
    containScroll: 'trimSnaps',
    duration: reduce ? 0 : 25,
  });

  const update = () => {
    prev.disabled = !embla.canScrollPrev();
    next.disabled = !embla.canScrollNext();
    total.textContent = String(embla.scrollSnapList().length);
    current.textContent = String(embla.selectedScrollSnap() + 1);
  };
  prev.addEventListener('click', () => embla.scrollPrev());
  next.addEventListener('click', () => embla.scrollNext());
  viewport.addEventListener('keydown', (e) => {
    if (e.target !== viewport) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); embla.scrollPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); embla.scrollNext(); }
  });
  embla.on('pointerDown', () => viewport.classList.add('is-dragging'));
  embla.on('pointerUp', () => viewport.classList.remove('is-dragging'));
  embla.on('select', update).on('reInit', update);
  update();
}
