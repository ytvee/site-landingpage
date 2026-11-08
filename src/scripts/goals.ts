// Цели Метрики по кликам (S-017). Без счётчика (window.ym нет) ничего не делает.
const rules: [RegExp, string][] = [
  [/^tel:/, 'call'],
  [/^https:\/\/t\.me\//, 'telegram'],
  [/^https:\/\/wa\.me\//, 'whatsapp'],
  [/^https:\/\/(yandex\.ru\/maps|2gis\.ru)\//, 'route'],
];

export function initGoals(): void {
  const id = (window as unknown as { __ymId?: number }).__ymId;
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest('a[href]');
    const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
    if (!a || typeof ym !== 'function' || id === undefined) return;
    const href = a.getAttribute('href') ?? '';
    const rule = rules.find(([re]) => re.test(href));
    if (rule) ym(id, 'reachGoal', rule[1]);
  });
}
