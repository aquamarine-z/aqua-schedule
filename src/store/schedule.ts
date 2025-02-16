
import defaultSchedule from "@/assets/se3_schedule.json"
import {atomWithStorage} from "jotai/utils";
export const ScheduleInformation=atomWithStorage("schedule-information",{
    selectedIndex:0,
    viewingWeekIndex:1,
    schedules:[defaultSchedule]
})