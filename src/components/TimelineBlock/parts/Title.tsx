import styles from "../TimelineBlock.module.scss";

type TitleProps = { title: string };

export default function Title({ title }: TitleProps) {
  return (
    <div className={styles.titleWrap}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
