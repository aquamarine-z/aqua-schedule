import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {useLocation} from "react-router-dom";
import {ScheduleInformation} from "@/store/schedule.ts";
import {useAtom} from "jotai";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    ArrowLeftIcon, ArrowUpIcon,
    DeleteIcon,
    MoreHorizontalIcon,

} from "lucide-react";
import {useEffect, useState} from "react";
import {Schedule} from "@/pages/schedule_extractor/ScheduleExtractor.tsx";
import defaultSchedule from "@/assets/se3_schedule.json";

export function AppTitleBar() {
    const location = useLocation()
    const [scheduleInformation, setScheduleInformation] = useAtom(ScheduleInformation)
    const schedule = scheduleInformation.schedules[scheduleInformation.selectedIndex]
    const [popoverOpen, setPopoverOpen] = useState(false)
    useEffect(() => {
        if (scheduleInformation.selectedIndex >= scheduleInformation.schedules.length || scheduleInformation.selectedIndex < 0) {
            setScheduleInformation({...scheduleInformation, selectedIndex: 0})
        }
    }, [scheduleInformation.selectedIndex]);
    const startDate = new Date()
    startDate.setMonth(parseInt(schedule.startTime.month))
    startDate.setDate(parseInt(schedule.startTime.dayOfMonth))
    startDate.setFullYear(parseInt(schedule.startTime.year))
    return <div className={"h-12 w-full shadow flex flex-row items-center gap-4 pr-4 pl-4"}>
        <SidebarTrigger className={"w-12 h-12 p-2 font-serif"}/>
        {location.pathname === "/" && <><span className={"font-semibold text-md text-gray-500"}>
                            {new Date().toLocaleDateString()}
                        </span><span
            className={"font-semibold text-md text-gray-500"}>{startDate > new Date() ? "未开学" : "已开学"}</span>
            <span
                className={"font-semibold text-md text-gray-500"}>第{scheduleInformation.viewingWeekIndex}周</span>
            <div className={"grow"}></div>
            <Popover open={popoverOpen} onOpenChange={open => setPopoverOpen(open)}>
                <PopoverTrigger asChild>
                    <Button onClick={() => setPopoverOpen(!popoverOpen)} variant="outline">{popoverOpen ?
                        <ArrowUpIcon/> : <MoreHorizontalIcon/>}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 mr-2 flex items-center flex-col gap-4">
                    <Button variant={"ghost"}>
                        <ArrowLeftIcon/>修改课程表名称
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        if (confirm("确定删除此课程表吗?")) {
                            const newSchedules = scheduleInformation.schedules.filter((_item, index) => index !== scheduleInformation.selectedIndex)
                            if (newSchedules.length === 0) {
                                newSchedules.push(defaultSchedule as unknown as Schedule)
                            }
                            setScheduleInformation({
                                ...scheduleInformation,
                                schedules: newSchedules,
                                selectedIndex: 0
                            })
                            setPopoverOpen(false)
                        }

                    }}><DeleteIcon/>删除此课程表</Button>

                </PopoverContent>
            </Popover>
        </>
        }
    </div>
}