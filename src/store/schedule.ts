import defaultSchedule from "@/assets/swu_schedule.json"
import {atomWithStorage} from "jotai/utils";
import {Schedule} from "@/constants/schedule-types.ts";

export const ScheduleInformation = atomWithStorage("schedule-information", {
    selectedIndex: 0,
    viewingWeekIndex: 1,
    schedules: [defaultSchedule] as unknown as Schedule[]
})