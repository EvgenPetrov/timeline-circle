import TimelineBlock from "@/components/TimelineBlock";
import { segmentsMaxDemo } from "@/data/timelineData";

export default function App() {
  return (
    <main className="page">
      <TimelineBlock segments={segmentsMaxDemo} />
    </main>
  );
}
