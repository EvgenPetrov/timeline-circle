import { RefObject } from "react";
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
  resetKey: number; // чтобы сбрасывать на первый слайд при смене сегмента
  segmentId: string;
};

export default function EventsList({
  swiperRef,
  events,
  onSlideChange,
  resetKey,
  segmentId,
}: EventsListProps) {
  return (
    <div className={styles.events}>
      <Swiper
        key={resetKey}
        modules={[A11y]}
        slidesPerView={1}
        spaceBetween={24}
        onSwiper={(sw) => (swiperRef.current = sw)}
        onSlideChange={(sw) => onSlideChange(sw.activeIndex)}
        className={styles.swiperScoped}
        breakpoints={{ 768: { slidesPerView: 3, spaceBetween: 32 } }}
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
    </div>
  );
}
