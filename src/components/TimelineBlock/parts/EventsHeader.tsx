import styles from "../TimelineBlock.module.scss";

type EventsHeaderProps = {
  eventIndex: number;
  eventsTotal: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function EventsHeader({
  eventIndex,
  eventsTotal,
  onPrev,
  onNext,
}: EventsHeaderProps) {
  return (
    <div className={styles.eventsHeader}>
      <div className={styles.eventsCounter}>
        {String(eventIndex + 1).padStart(2, "0")} / {String(eventsTotal).padStart(2, "0")}
      </div>
      <div className={styles.eventsNav}>
        <button className={styles.eventsNavBtn} onClick={onPrev} aria-label="Предыдущий период">
          ‹
        </button>
        <button className={styles.eventsNavBtn} onClick={onNext} aria-label="Следующий период">
          ›
        </button>
      </div>
    </div>
  );
}
