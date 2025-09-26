import { useEffect, useMemo, useRef, useState } from "react";
import { TimelineSegment } from "@/data/timelineData";
import styles from "./TimelineBlock.module.scss";
import { gsap } from "gsap";
import { clampIndex, angleForIndex, nearestAngle, anchorPosition } from "./helpers/math";
import { animateRing } from "./helpers/ring";
import Title from "./parts/Title";
import Circle, { CirclePoint } from "./parts/Circle";
import EventsHeader from "./parts/EventsHeader";
import EventsList from "./parts/EventsList";

type Props = {
  segments: TimelineSegment[];
  initialIndex?: number;
  title?: string;
};

export default function TimelineBlock({
  segments,
  initialIndex = 0,
  title = "Исторические даты",
}: Props) {
  const [active, setActive] = useState(clampIndex(initialIndex, segments.length));
  const activeSegment = segments[active];

  // swiper + счётчик событий
  const swiperRef = useRef<any | null>(null);
  const [eventIndex, setEventIndex] = useState(0);

  // refs для анимаций лет
  const leftYearRef = useRef<HTMLSpanElement>(null);
  const rightYearRef = useRef<HTMLSpanElement>(null);

  // кольцо
  const ringRef = useRef<HTMLDivElement>(null);
  const [ringDeg, setRingDeg] = useState(0);

  // позиция бейджа
  const anchorDeg = -30;
  const anchorPos = useMemo(() => anchorPosition(anchorDeg), []);

  // точки по окружности
  const points: CirclePoint[] = useMemo(() => {
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

  // анимация больших лет
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

  // поворот кольца
  useEffect(() => {
    const n = segments.length;
    const target = anchorDeg - angleForIndex(active, n);
    const snapped = nearestAngle(ringDeg, target);

    animateRing({ elem: ringRef.current, fromDeg: ringDeg, toDeg: snapped });

    setRingDeg(snapped);
    setEventIndex(0);
    swiperRef.current?.slideTo(0, 0);
  }, [active, segments.length]);

  const nextSegment = () => setActive((a) => clampIndex(a + 1, segments.length));
  const prevSegment = () => setActive((a) => clampIndex(a - 1, segments.length));

  const segmentsTotal = segments.length;

  return (
    <section className={styles.wrapper} aria-label="Исторические даты">
      <div className={styles.inner}>
        <Title title={title} />

        <Circle
          ringRef={ringRef}
          ringDeg={ringDeg}
          points={points}
          activeIndex={active}
          onPointClick={setActive}
          anchorPos={anchorPos}
          activeLabel={activeSegment.label}
          startYear={activeSegment.startYear}
          endYear={activeSegment.endYear}
          leftYearRef={leftYearRef}
          rightYearRef={rightYearRef}
        />

        <EventsHeader
          eventIndex={active}
          eventsTotal={segmentsTotal}
          onPrev={prevSegment}
          onNext={nextSegment}
        />

        <EventsList
          swiperRef={swiperRef}
          events={activeSegment.events}
          onSlideChange={setEventIndex}
          resetKey={active}
          segmentId={activeSegment.id}
        />
      </div>
    </section>
  );
}
