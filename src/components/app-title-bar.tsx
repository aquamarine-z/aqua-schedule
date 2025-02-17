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
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";

export function AppTitleBar() {
    const location = useLocation()
    const [scheduleInformation, setScheduleInformation] = useAtom(ScheduleInformation)
    const schedule = scheduleInformation.schedules[scheduleInformation.selectedIndex]
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [renameName, setRenameName] = useState("")
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
            <span className={"font-semibold text-md text-gray-500"}>第{scheduleInformation.viewingWeekIndex}周</span>
            <div className={"grow"}></div>
            <Popover open={popoverOpen} onOpenChange={open => setPopoverOpen(open)}>
                <PopoverTrigger asChild>
                    <Button onClick={() => setPopoverOpen(!popoverOpen)} variant="outline">{popoverOpen ?
                        <ArrowUpIcon/> : <MoreHorizontalIcon/>}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 mr-2 flex items-center flex-col gap-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" onClick={() => {
                                //setPopoverOpen(false)
                            }}>
                                <ArrowLeftIcon/>修改课程表名称
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className={"w-3/4 h-3/8 flex flex-col justify-center items-center pb-2 pt-2 gap-10"}>
                            <DialogHeader>
                                <DialogTitle>
                                    <h1>修改课程表名称</h1>
                                </DialogTitle>
                            </DialogHeader>
                            <Input className={"w-9/10"} placeholder={"课程表新名称"} value={renameName} onChange={e => {
                                setRenameName(e.target.value)
                            }}>

                            </Input>
                            <div className={"flex flex-row items-center justify-around w-full gap-2"}>
                                <DialogClose className={"w-[45%]"}>
                                    <Button className={"w-full"} variant={"secondary"}>取消</Button>
                                </DialogClose>
                                <DialogClose className={"w-[45%]"} onClick={() => {
                                    if (renameName === "") {
                                        alert("课程表名称不能为空")
                                        return
                                    }
                                    const newSchedules = [...scheduleInformation.schedules]
                                    newSchedules[scheduleInformation.selectedIndex].name = renameName
                                    setScheduleInformation({...scheduleInformation, schedules: newSchedules})
                                    alert("修改成功")
                                    setPopoverOpen(false)

                                }}>
                                    <Button className={"w-full"}>确认</Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
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