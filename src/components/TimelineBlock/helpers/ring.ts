import { gsap } from "gsap";

/**
 * 1:1 повторяет твою анимацию из useEffect:
 * — крутим rotation элемента
 * — синхронизируем css-переменную --ring
 */
export function animateRing(opts: { elem: HTMLDivElement | null; fromDeg: number; toDeg: number }) {
  const { elem, fromDeg, toDeg } = opts;
  if (!elem) return;

  const diff = Math.abs(((toDeg - fromDeg + 540) % 360) - 180);
  const duration = gsap.utils.mapRange(0, 180, 0.25, 0.9, diff);

  gsap.to(elem, {
    rotation: toDeg,
    duration,
    ease: "sine.inOut",
    overwrite: "auto",
    onUpdate: () => {
      const rot = gsap.getProperty(elem, "rotation") as number;
      elem.style.setProperty("--ring", `${rot}deg`);
    },
    onStart: () => {
      elem.style.setProperty("--ring", `${fromDeg}deg`);
    },
    onComplete: () => {
      elem.style.setProperty("--ring", `${toDeg}deg`);
    },
  });
}
