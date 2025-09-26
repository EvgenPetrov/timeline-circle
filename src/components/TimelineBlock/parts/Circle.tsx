import { Ref, RefObject } from "react";
import styles from "../TimelineBlock.module.scss";

export type CirclePoint = {
  id: string;
  i: number;
  x: number;
  y: number;
  label: string;
};

type CircleProps = {
  ringRef: Ref<HTMLDivElement>; // <-- принимает любой валидный ref
  ringDeg: number;
  points: CirclePoint[];
  activeIndex: number;
  onPointClick: (i: number) => void;

  anchorPos: { x: number; y: number };
  activeLabel: string;
  startYear: number;
  endYear: number;

  leftYearRef: Ref<HTMLSpanElement>;
  rightYearRef: Ref<HTMLSpanElement>;
};

export default function Circle({
  ringRef,
  ringDeg,
  points,
  activeIndex,
  onPointClick,
  anchorPos,
  activeLabel,
  startYear,
  endYear,
  leftYearRef,
  rightYearRef,
}: CircleProps) {
  return (
    <div className={styles.centerRow}>
      <div className={styles.circle}>
        <div className={styles.ring} ref={ringRef} style={{ ["--ring" as any]: `${ringDeg}deg` }}>
          {points.map((p) => (
            <button
              key={p.id}
              className={`${styles.point} ${p.i === activeIndex ? styles.pointActive : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              data-index={p.i + 1}
              onClick={() => onPointClick(p.i)}
              aria-label={`Перейти к разделу: ${p.label}`}
            />
          ))}
        </div>

        <span className={styles.crossV} aria-hidden />
        <span className={styles.crossH} aria-hidden />

        <div
          className={styles.activeBadge}
          style={{ left: `${anchorPos.x}%`, top: `${anchorPos.y}%` }}>
          <span className={styles.badgeNum}>{activeIndex + 1}</span>
          <span className={styles.badgeText}>{activeLabel}</span>
        </div>

        <div className={styles.bigYears}>
          <span ref={leftYearRef} className={styles.leftYear}>
            {startYear}
          </span>
          <span ref={rightYearRef} className={styles.rightYear}>
            {endYear}
          </span>
        </div>
      </div>
    </div>
  );
}
