import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {cn} from "@/lib/utils.ts";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import swuTimeTable from "@/assets/swu_schedule.json";

import {useAtom} from "jotai";
import {ScheduleInformationAtom} from "@/store/schedule.ts";
import {ClassTime} from "@/constants/schedule-types.ts";
import {toast} from "sonner";

export function ScheduleImporter() {
    const [scheduleList, setScheduleList] = useState(null)
    const [startDate, setStartDate] = useState(new Date())
    const [scheduleName, setScheduleName] = useState("")
    const [timeTable, setTimeTable] = useState(swuTimeTable["timeTable"])
    const [scheduleInformation, setScheduleInformation] = useAtom(ScheduleInformationAtom)
    const getDataFromClipboard = async () => {
        return await navigator.clipboard.readText();

    }
    const getDataFromFile = () => {
        return new Promise((resolve, reject) => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "application/json";
            fileInput.onchange = () => {
                const file = fileInput.files?.[0];
                if (!file) {
                    reject(new Error("No file selected"));
                    return;
                }

                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    //console.log(reader.result)
                    resolve(reader.result);
                };

                reader.onerror = () => {
                    reject(new Error("Error reading file"));
                };
            };

            // 模拟用户点击以打开文件选择对话框
            fileInput.click();
        });
    };
    const importData = async (text: string) => {
        try {
            const data = JSON.parse(text)
            if (data["classes"]) {
                setScheduleList(data["classes"])
            }
            if (data["startTime"]) {
                startDate.setDate(data["startTime"]["dayOfMonth"])
                startDate.setMonth(data["startTime"]["month"] - 1)
                startDate.setFullYear(data["startTime"]["year"])
                setStartDate(startDate)
            }
            if (data["name"]) {
                setScheduleName(data["name"])
            }
            if (data["timeTable"]) {
                setTimeTable(data["timeTable"])
            }
            if (data instanceof Array) {
                let isTimeTable = true
                data.forEach((item) => {
                    if (!item.from || !item.to) {
                        isTimeTable = false
                    }
                    if (!item.from.minute || !item.from.hour) {
                        isTimeTable = false
                    }
                    if (!item.to.minute || !item.to.hour) {
                        isTimeTable = false
                    }
                })
                if (isTimeTable) {
                    
                    setTimeTable(data as ClassTime[])
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return
        }
    }
    return <div className={"w-full h-full overflow-y-auto flex flex-col gap-8 pr-10 pl-10 items-center justify-center"}>
        <h1 className={"text-primary font-semibold font-sans text-3xl"}>课程表导入</h1>
        <div className={"w-full flex flex-row items-center justify-center gap-2"}>
            <h1 className={"w-[30%] text-center"}>课程表名称</h1>
            <Input className={"w-[65%]"} onChange={(e) => setScheduleName(e.target.value)} value={scheduleName}
                   placeholder={"请输入"}/>
        </div>
        <div className={"w-full flex flex-row items-center justify-center gap-2"}>
            <h1 className={"w-[30%] text-center"}>课程数据</h1>
            <span className={"w-[65%] text-center"}>{scheduleList ? "已导入" : "未导入"}</span>
        </div>
        <div className={"w-full flex flex-row items-center justify-center gap-2"}>
            <h1 className={"w-[30%] text-center"}>开始日期</h1>
            <div className={"w-[65%]"}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                " justify-start text-left font-normal w-full",
                                !startDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon/>
                            {startDate ? startDate.toLocaleDateString() : <span>请选择日期</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => setStartDate(date as Date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

        </div>
        <div className={"w-full flex flex-row items-center justify-center gap-2"}>
            <h1 className={"w-[30%] text-center"}>时间表</h1>
            <span className={"w-[65%] text-center"}>{timeTable ? "已导入" : "未导入"}</span>
        </div>
        <div className={"flex flex-row gap-2 items-center justify-center"}>
            <Button className={"w-1/2"} variant={"secondary"} onClick={() => {
                getDataFromClipboard().then((data) => importData(data))
            }}>从剪贴板导入</Button>
            <Button className={"w-1/2"} variant={"secondary"}
                    onClick={() => getDataFromFile().then(data => importData(data as string))}>从文件导入</Button>
        </div>
        <Button 
            disabled={!scheduleName||scheduleName.trim()===""||!timeTable||timeTable.length===0||!scheduleList}
            onClick={() => {
            if (scheduleInformation.schedules.map(it => it.name).includes(scheduleName)) {
                toast(<><span className={"text-red-500"}>课程表名字重复!</span></>)
                return
            }
            if(!scheduleName||scheduleName.trim()==="") {
                toast(<><span className={"text-red-500"}>课程表名字不能为空!</span></>)
                return
            }
            const newSchedule = {
                name: scheduleName,
                startTime: {
                    year: startDate.getFullYear().toString(),
                    month: (startDate.getMonth() + 1).toString(),
                    dayOfMonth: startDate.getDate().toString()
                },
                classes: scheduleList,
                timeTable: timeTable,
                schoolName:"swu"
            }
            toast("保存成功!")
            setScheduleInformation({...scheduleInformation, schedules: [...scheduleInformation.schedules, newSchedule]})
        }}>保存到列表</Button>

    </div>
}