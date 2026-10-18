import { Header } from "@/components/layout/header";
import { ScheduleView } from "./schedule-view";

export default function SchedulePage() {
  return (
    <>
      <Header
        title="Schedule"
        description="Your weekly timetable and upcoming sessions."
      />
      <div className="p-6">
        <ScheduleView />
      </div>
    </>
  );
}
