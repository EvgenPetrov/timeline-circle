import { useEffect, useMemo, useRef, useState } from "react";
import { TimelineSegment } from "@/data/timelineData";
import styles from "./TimelineBlock.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { A11y } from "swiper/modules";
import "swiper/css";
import { gsap } from "gsap";

type Props = {
  segments: TimelineSegment[];
  initialIndex?: number;
  title?: string;
};

const clampIndex = (i: number, n: number) => (i + n) % n;
const angleForIndex = (i: number, n: number) => i * (360 / n) - 90; // 0° = вверх
const nearestAngle = (current: number, target: number) => {
  let delta = ((target - current + 540) % 360) - 180;
  return current + delta;
};

export default function TimelineBlock({
  segments,
  initialIndex = 0,
  title = "Исторические даты",
}: Props) {
  const [active, setActive] = useState(clampIndex(initialIndex, segments.length));
  const activeSegment = segments[active];

  // события (нижний слайдер)
  const swiperRef = useRef<SwiperType | null>(null);
  const [eventIndex, setEventIndex] = useState(0);

  // анимации лет
  const leftYearRef = useRef<HTMLSpanElement>(null);
  const rightYearRef = useRef<HTMLSpanElement>(null);

  // вращаемое кольцо
  const ringRef = useRef<HTMLDivElement>(null);
  const [ringDeg, setRingDeg] = useState(0);

  // якорь активного бейджа — чуть правее верха окружности
  const anchorDeg = -30;
  const anchorRad = (Math.PI / 180) * anchorDeg;
  const anchorPos = useMemo(() => {
    const r = 50; // радиус в %
    const c = 50; // центр в %
    return { x: c + r * Math.cos(anchorRad), y: c + r * Math.sin(anchorRad) };
  }, []);

  // координаты точек (равномерно по окружности)
  const points = useMemo(() => {
    const n = segments.length;
    const r = 50;
    const c = { x: 50, y: 50 };
    return segments.map((s, i) => {
      const ang = (i / n) * 2 * Math.PI - Math.PI / 2;
      return {
        id: s.id,
        i,
        x: c.x + r * Math.cos(ang),
        y: c.y + r * Math.sin(ang),
        label: s.label,
      };
    });
  }, [segments]);

  // плавная смена лет
  useEffect(() => {
    gsap.fromTo(
      leftYearRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
    );
    gsap.fromTo(
      rightYearRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power2.out", delay: 0.05 }
    );
  }, [active]);

  // поворот кольца так, чтобы активная точка ушла в якорь
  useEffect(() => {
    const n = segments.length;
    const target = anchorDeg - angleForIndex(active, n);
    const snapped = nearestAngle(ringDeg, target);
    const diff = Math.abs(((snapped - ringDeg + 540) % 360) - 180);
    const duration = gsap.utils.mapRange(0, 180, 0.25, 0.9, diff);

    gsap.to(ringRef.current, {
      rotation: snapped,
      duration,
      ease: "sine.inOut",
      overwrite: "auto",
      onUpdate: () => {
        const rot = gsap.getProperty(ringRef.current!, "rotation") as number;
        (ringRef.current as HTMLElement).style.setProperty("--ring", `${rot}deg`);
      },
      onStart: () => {
        (ringRef.current as HTMLElement).style.setProperty("--ring", `${ringDeg}deg`);
      },
      onComplete: () => {
        (ringRef.current as HTMLElement).style.setProperty("--ring", `${snapped}deg`);
      },
    });

    setRingDeg(snapped);
    setEventIndex(0);
    swiperRef.current?.slideTo(0, 0);
  }, [active, segments.length]);

  const nextSegment = () => setActive((a) => clampIndex(a + 1, segments.length));
  const prevSegment = () => setActive((a) => clampIndex(a - 1, segments.length));

  const eventsTotal = activeSegment.events.length;

  return (
    <section className={styles.wrapper} aria-label="Исторические даты">
      <div className={styles.gridDecor} aria-hidden />
      <div className={styles.decorBar} aria-hidden />

      <div className={styles.headerRow}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.centerRow}>
        <div className={styles.circle}>
          <div className={styles.ring} ref={ringRef} style={{ ["--ring" as any]: `${ringDeg}deg` }}>
            {points.map((p) => (
              <button
                key={p.id}
                className={`${styles.point} ${p.i === active ? styles.pointActive : ""}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                data-index={p.i + 1}
                onClick={() => setActive(p.i)}
                aria-label={`Перейти к разделу: ${p.label}`}
              />
            ))}
          </div>

          <span className={styles.crossV} aria-hidden />
          <span className={styles.crossH} aria-hidden />

          <div
            className={styles.activeBadge}
            style={{ left: `${anchorPos.x}%`, top: `${anchorPos.y}%` }}>
            <span className={styles.badgeNum}>{active + 1}</span>
            <span className={styles.badgeText}>{activeSegment.label}</span>
          </div>

          <div className={styles.bigYears}>
            <span ref={leftYearRef} className={styles.leftYear}>
              {activeSegment.startYear}
            </span>
            <span ref={rightYearRef} className={styles.rightYear}>
              {activeSegment.endYear}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.eventsHeader}>
        <div className={styles.eventsCounter}>
          {String(eventIndex + 1).padStart(2, "0")} / {String(eventsTotal).padStart(2, "0")}
        </div>
        <div className={styles.eventsNav}>
          <button
            className={styles.eventsNavBtn}
            onClick={prevSegment}
            aria-label="Предыдущий период">
            ‹
          </button>
          <button
            className={styles.eventsNavBtn}
            onClick={nextSegment}
            aria-label="Следующий период">
            ›
          </button>
        </div>
      </div>

      <div className={styles.events}>
        <Swiper
          modules={[A11y]}
          slidesPerView={1}
          spaceBetween={24}
          onSwiper={(sw) => (swiperRef.current = sw)}
          onSlideChange={(sw) => setEventIndex(sw.activeIndex)}
          className={styles.swiperScoped}
          breakpoints={{ 768: { slidesPerView: 3, spaceBetween: 32 } }}
          a11y={{
            prevSlideMessage: "Предыдущее событие",
            nextSlideMessage: "Следующее событие",
          }}>
          {activeSegment.events.map((ev) => (
            <SwiperSlide key={`${activeSegment.id}-${ev.year}`}>
              <article className={styles.eventCard}>
                <h3 className={styles.eventYear}>{ev.year}</h3>
                <p className={styles.eventTitle}>{ev.title}</p>
                <p className={styles.eventText}>{ev.text}</p>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
