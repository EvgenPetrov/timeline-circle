export type TimelineEvent = {
  year: number;
  title: string;
  text: string;
};

export type TimelineSegment = {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  events: TimelineEvent[];
};

export const segmentsMaxDemo: TimelineSegment[] = [
  {
    id: "seg-1",
    label: "Кино",
    startYear: 1987,
    endYear: 1991,
    events: [
      { year: 1988, title: "«Кто подставил кролика Роджера»", text: "США, реж. Роберт Земекис." },
      { year: 1989, title: "«Назад в будущее 2»", text: "США, реж. Роберт Земекис." },
      { year: 1990, title: "«Крепкий орешек 2»", text: "США, реж. Ренни Харлин." },
    ],
  },
  {
    id: "seg-2",
    label: "Литература",
    startYear: 1992,
    endYear: 1997,
    events: [
      {
        year: 1992,
        title: "Нобелевская премия — Дерек Уолкотт",
        text: "«За блестящий образец карибского эпоса».",
      },
      { year: 1994, title: "«Бессонница»", text: "Роман Стивена Кинга." },
      { year: 1997, title: "«Гарри Поттер и философский камень»", text: "Дж. К. Роулинг." },
    ],
  },
  {
    id: "seg-3",
    label: "Театр",
    startYear: 1999,
    endYear: 2004,
    events: [
      { year: 1999, title: "Балет «Золушка»", text: "Постановка Жан-Кристофа Майо." },
      { year: 2002, title: "«Берег Утопии»", text: "Трилогия Т. Стоппарда, Лондон." },
      { year: 2003, title: "Пожар в «Ла Фениче»", text: "Венеция." },
    ],
  },
  {
    id: "seg-4",
    label: "Наука",
    startYear: 2015,
    endYear: 2022,
    events: [
      { year: 2015, title: "Частное солнечное затмение", text: "Южная Африка и Антарктида." },
      {
        year: 2016,
        title: "Галактика GN-z11",
        text: "Самая удалённая из обнаруженных на тот момент.",
      },
      { year: 2017, title: "Tesla Semi", text: "Представлен первый электрокамаз Tesla." },
    ],
  },
];
