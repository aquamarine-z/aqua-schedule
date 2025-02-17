
import defaultSchedule from "@/assets/se3_schedule.json"
import {atomWithStorage} from "jotai/utils";
import {Schedule} from "@/pages/schedule_extractor/ScheduleExtractor.tsx";
export const ScheduleInformation=atomWithStorage("schedule-information",{
    selectedIndex:0,
    viewingWeekIndex:1,
    schedules: [defaultSchedule] as unknown as Schedule[]
})