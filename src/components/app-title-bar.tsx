import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {useLocation} from "react-router-dom";
import {ScheduleInformation} from "@/store/schedule.ts";
import {useAtom} from "jotai";

export function AppTitleBar() {
    const location = useLocation()
    const scheduleInformation = useAtom(ScheduleInformation)[0]
    const schedule = scheduleInformation.schedules[scheduleInformation.selectedIndex]
    const startDate = new Date()
    startDate.setMonth(parseInt(schedule.startTime.month))
    startDate.setDate(parseInt(schedule.startTime.dayOfMonth))
    startDate.setFullYear(parseInt(schedule.startTime.year))
    return <div className={"h-12 w-full shadow flex flex-row items-center gap-4"}>
        <SidebarTrigger className={"w-12 h-12 p-2"}/>
        {location.pathname === "/schedule_viewer" && <><span className={"font-semibold text-lg text-gray-500"}>
                            {new Date().toLocaleDateString()}
                        </span><span
            className={"font-semibold text-lg text-gray-500"}>{startDate > new Date() ? "未开学" : "已开学"}</span></>
        }
    </div>
}