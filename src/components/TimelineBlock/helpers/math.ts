export const clampIndex = (i: number, n: number) => (i + n) % n;

export const angleForIndex = (i: number, n: number) => i * (360 / n) - 90;

/** найти ближайший к current угол (в пределах −180..180 от current) */
export const nearestAngle = (current: number, target: number) => {
  const delta = ((target - current + 540) % 360) - 180;
  return current + delta;
};

/** позиция якоря для бейджа — переносим вычисление как функцию */
export const anchorPosition = (deg: number) => {
  const r = 50;
  const c = 50;
  const rad = (Math.PI / 180) * deg;
  return { x: c + r * Math.cos(rad), y: c + r * Math.sin(rad) };
};
