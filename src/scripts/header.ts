const HOVER_DELAY = 150;

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const burger = header.querySelector<HTMLButtonElement>('[data-burger]');
  const panel = header.querySelector<HTMLElement>('[data-panel]');
  const groups = [...header.querySelectorAll<HTMLElement>('[data-group]')];
  const canHover = window.matchMedia('(hover: hover) and (min-width: 900px)');

  const btnOf = (g: HTMLElement) => g.querySelector<HTMLButtonElement>(':scope > button')!;
  const setGroup = (g: HTMLElement, open: boolean) => btnOf(g).setAttribute('aria-expanded', String(open));
  const closeGroups = (except?: HTMLElement) => groups.forEach((g) => g !== except && setGroup(g, false));
  const setPanel = (open: boolean) => {
    if (!burger || !panel) return;
    burger.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
  };

  groups.forEach((g) => {
    const btn = btnOf(g);
    let timer: number | undefined;
    let hoverOpenedAt = 0;
    btn.addEventListener('click', () => {
      // Клик сразу после открытия по наведению не должен закрывать список.
      const open = Date.now() - hoverOpenedAt < 500 || btn.getAttribute('aria-expanded') !== 'true';
      closeGroups(g);
      setGroup(g, open);
    });
    g.addEventListener('mouseenter', () => {
      if (!canHover.matches) return;
      window.clearTimeout(timer);
      closeGroups(g);
      if (btn.getAttribute('aria-expanded') !== 'true') hoverOpenedAt = Date.now();
      setGroup(g, true);
    });
    g.addEventListener('mouseleave', () => {
      if (!canHover.matches) return;
      timer = window.setTimeout(() => setGroup(g, false), HOVER_DELAY);
    });
    g.addEventListener('focusout', (e) => {
      if (!g.contains(e.relatedTarget as Node | null)) setGroup(g, false);
    });
  });

  burger?.addEventListener('click', () => setPanel(burger.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target as Node)) {
      closeGroups();
      setPanel(false);
    }
  });

  header.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = groups.find((g) => btnOf(g).getAttribute('aria-expanded') === 'true');
    if (open) {
      setGroup(open, false);
      btnOf(open).focus();
    } else if (burger?.getAttribute('aria-expanded') === 'true') {
      setPanel(false);
      burger.focus();
    }
  });

  header.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', () => {
      closeGroups();
      setPanel(false);
    }),
  );
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) setPanel(false);
  });
}
