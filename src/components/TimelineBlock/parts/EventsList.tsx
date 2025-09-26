import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import styles from "../TimelineBlock.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { A11y } from "swiper/modules";
import "swiper/css";

export type TimelineEvent = { year: number; title: string; text: string };

type EventsListProps = {
  swiperRef: RefObject<SwiperType | null>;
  events: TimelineEvent[];
  onSlideChange: (i: number) => void;
  resetKey: number;
  segmentId: string;
};

export default function EventsList({
  swiperRef,
  events,
  onSlideChange,
  resetKey,
  segmentId,
}: EventsListProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  // мобильный порог
  const isMobile = useMedia("(max-width: 767px)");

  const updateNav = useCallback(
    (sw: SwiperType | null) => {
      if (!sw) return;
      const spv = (sw.params.slidesPerView as number) || 1;
      const total = events.length;
      const i = sw.activeIndex ?? 0;
      const maxIdx = Math.max(0, total - spv);
      setShowPrev(i > 0);
      setShowNext(i < maxIdx);
      setActiveIdx(i);
    },
    [events.length]
  );

  useEffect(() => {
    
    updateNav(swiperRef.current);
  }, [events.length, resetKey, updateNav]);

  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();

  return (
    <div className={styles.events}>
      <Swiper
        key={resetKey}
        modules={[A11y]}
        slidesPerView={1}
        spaceBetween={24}
        breakpoints={{ 768: { slidesPerView: 3, spaceBetween: 32 } }}
        onSwiper={(sw) => {
          swiperRef.current = sw;
          requestAnimationFrame(() => updateNav(sw));
        }}
        onSlideChange={(sw) => {
          onSlideChange(sw.activeIndex);
          updateNav(sw);
        }}
        onResize={(sw) => updateNav(sw)}
        onBreakpoint={(sw) => updateNav(sw)}
        className={styles.swiperScoped}
        a11y={{
          prevSlideMessage: "Предыдущее событие",
          nextSlideMessage: "Следующее событие",
        }}>
        {events.map((ev) => (
          <SwiperSlide key={`${segmentId}-${ev.year}`}>
            <article className={styles.eventCard}>
              <h3 className={styles.eventYear}>{ev.year}</h3>
              <p className={styles.eventTitle}>{ev.title}</p>
              <p className={styles.eventText}>{ev.text}</p>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      
      {!isMobile && showPrev && (
        <button
          className={`${styles.eventsSliderBtn} ${styles.eventsSliderBtnLeft}`}
          onClick={slidePrev}
          aria-label="Показать предыдущие события">
          ‹
        </button>
      )}
      {!isMobile && showNext && (
        <button
          className={`${styles.eventsSliderBtn} ${styles.eventsSliderBtnRight}`}
          onClick={slideNext}
          aria-label="Показать следующие события">
          ›
        </button>
      )}

      
      {isMobile && events.length > 1 && (
        <div className={styles.eventsDots} role="tablist" aria-label="Пагинация событий">
          {events.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Слайд ${i + 1}`}
              className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ""}`}
              onClick={() => swiperRef.current?.slideTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}


function useMedia(query: string) {
  const get = () => (typeof window !== "undefined" ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}
