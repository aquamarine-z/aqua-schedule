import {Button} from "@/components/ui/button.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {CalendarIcon} from "lucide-react";
import {useState} from "react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {cn} from "@/lib/utils.ts";
import swuSchedule from "@/assets/swu_schedule.json"
import {useAtom} from "jotai";
import {ScheduleInformation} from "@/store/schedule.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const scheduleMap = new Map<string, ClassTime[]>([['swu', swuSchedule]])

export class ScheduleClass {
    name: string = ""
    teachers: string[] = []
    classIndexFrom: number = 0
    classIndexTo: number = 0
    weekIndex: number[] = []
    weekday: number = 0
    classLocation: string = ""
    teachingClassName: string = ""
    teachingClassComposition: string = ""
    examinationType: string = ""
    comment: string = ""
    timeComposition: string = ""
    weekTime: number = 0
    totalTime: number = 0
    point: number = 0
    classType: number = 0
}

export interface ClassTime {
    from: { hour: number, minute: number }
    to: { hour: number, minute: number }
}

export class Schedule {
    schedule: ScheduleClass[] = []
    classTimes: ClassTime[] = []
    startTime: {
        year: string
        month: string
        dayOfMonth: string
    } = {
        year: "2025",
        month: "2",
        dayOfMonth: "24"
    }
    name: string = ""
}

export function extractSchedule(textContent: string) {
    const resultArray: ScheduleClass[] = []
    const domTree = new DOMParser().parseFromString(textContent, "text/html")
    const table = domTree.querySelector("table")
    
    if (table === null) {
        alert("DomTree格式错误")
        return null
    }
    const classElements = table.querySelectorAll("td.td_wrap")
    classElements.forEach(classElement => {
        if (classElement === null || classElement.innerHTML === "") return
        const classes = classElement.querySelectorAll("div.timetable_con")
        const weekday = parseInt(classElement.id.split("-")[0], 10)
        classes.forEach(classElement => {
            let timeElement: string | null = null
            let classLocationElement: string | null = null
            let teacherElement: string | null = null
            let teachingClassNameElement: string | null = null
            let teachingClassCompositionElement: string | null = null
            let examinationTypeElement: string | null = null
            let commentElement: string | null = null
            let timeCompositionElement: string | null = null
            let weekTimeElement: string | null = null
            let totalTimeElement: string | null = null
            let pointElement: string | null = null
            
            let name = classElement.querySelector("span.title font")?.textContent || ""
            let classType: number
            switch (name.charAt(name.length - 1)) {
                case "◆":
                    classType = 1
                    break
                case "◇":
                    classType = 2
                    break
                default:
                    classType = 0
                    break

            }
            name = name.slice(0, name.length - 1)
            classElement.querySelectorAll("p").forEach(pElement => {
                const span = pElement.querySelector("span")
                switch (span?.title) {
                    case "节/周":
                        timeElement = pElement.textContent
                        break
                    case "上课地点":
                        classLocationElement = pElement.textContent?.trim() || ""
                        break
                    case "教师 ":
                        teacherElement = pElement.textContent
                        break
                    case "教学班名称":
                        teachingClassNameElement = pElement.textContent
                        break
                    case "教学班组成":
                        teachingClassCompositionElement = pElement.textContent
                        break
                    case "考核方式":
                        examinationTypeElement = pElement.textContent
                        break
                    case "选课备注":
                        commentElement = pElement.textContent
                        break
                    case "课程学时组成":
                        timeCompositionElement = pElement.textContent
                        break
                    case "周学时":
                        weekTimeElement = pElement.textContent
                        break
                    case "总学时":
                        totalTimeElement = pElement.textContent
                        break
                    case "学分":
                        pointElement = pElement.textContent
                        break
                }
            })
            //console.log(timeElement)
            const pattern = /\((\d+)(?:-(\d+))?节\)(\d+(?:-\d+)?周)/;
            const match = timeElement!.match(pattern);
            const classInformation = {
                name,
            } as ScheduleClass
            if (match) {
                const classIndexFrom = parseInt(match[1], 10);
                const classIndexTo = parseInt(match[2], 10);
                const weekInformationString = match[3];
                if (weekInformationString.includes("-")) {
                    classInformation.weekIndex = []
                    const [weekIndexFrom, weekIndexTo] = weekInformationString.split("-").map(weekIndex => parseInt(weekIndex, 10));
                    for (let i = weekIndexFrom; i <= weekIndexTo; i++) {
                        classInformation.weekIndex.push(i)
                    }
                } else {
                    classInformation.weekIndex = [parseInt(weekInformationString, 10)];
                }
                classInformation.classIndexFrom = classIndexFrom
                classInformation.classIndexTo = classIndexTo

            } else {
                console.error("字符串格式不匹配");

            }
            classInformation.weekday = weekday
            classInformation.classLocation = classLocationElement!
            classInformation.teachers = teacherElement!.split(",").map(teacher => teacher.trim()) || []
            classInformation.teachingClassName = teachingClassNameElement || ""
            classInformation.teachingClassComposition = teachingClassCompositionElement || ""
            classInformation.examinationType = examinationTypeElement || ""
            classInformation.comment = commentElement || ""
            classInformation.timeComposition = timeCompositionElement || ""
            classInformation.weekTime = parseInt(weekTimeElement || "0", 10)
            classInformation.totalTime = parseInt(totalTimeElement || "0", 10)
            classInformation.point = parseFloat(pointElement || "0")
            classInformation.classType = classType
            resultArray.push(classInformation)
        })

    })
    return resultArray
}

export function ScheduleExtractor() {
    const [date, setDate] = useState<Date>(new Date())
    const [name, setName] = useState<string>("")
    const [scheduleTime, setScheduleTime] = useState<string>("swu")
    const [scheduleInformation,setScheduleInformation]=useAtom(ScheduleInformation)
    const analyze = async () => {
        if(scheduleInformation.schedules.map(it=>it.name).includes(name)){
            alert("课程表名称重复!")
            return
        }
        let textContent = ""
        try {
            const text = await navigator.clipboard.readText();
            //console.log('剪贴板的文本内容：', text);
            textContent = text
        } catch (err) {
            alert('读取剪贴板内容时出错:' + err);
            return
        }
        //从defaultDomTree解析
        const resultArray = extractSchedule(textContent)
        if (!resultArray) {
            alert("解析异常 请重试")
            return
        }
        if (confirm("解析完成 点击确认将其添加到课程表列表吗?")) {
            const schedule = new Schedule()
            schedule.schedule = resultArray
            schedule.name = name
            schedule.startTime = {
                year: date?.getFullYear().toString() || "2025",
                month: (date!.getMonth()!+1 || 1).toString(),
                dayOfMonth: (date?.getDate() || 1).toString()
            }
            schedule.classTimes = scheduleMap.get("swu")!
            setScheduleInformation({...scheduleInformation,schedules:[...scheduleInformation.schedules,schedule as Schedule]})
            alert("添加成功!")
        }
    }
    return <div className={"w-full h-full flex items-center justify-center"}>
        <div className={"flex flex-col gap-8 w-7/8 justify-center items-center"}>
            <h1 className={"text-2xl font-bold"}>课程表提取器</h1>
            <h2 className={"text-md font-medium text-center"}>请将课程表DomTree复制到剪贴板 并按下下方按钮进行解析</h2>
            <div className={"flex flex-row gap-2 w-full items-center justify-center"}>
                <h1 className={"select-none font-semibold"}>课程日程</h1>
                <Select defaultValue={scheduleTime} onValueChange={(value) => {
                    setScheduleTime(value)
                }}>
                    <SelectTrigger className="w-3/4">
                        <SelectValue placeholder="请选择课程时间信息"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>课程时间信息</SelectLabel>
                            <SelectItem value="swu">西南大学课程日程</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className={"flex flex-row gap-2 w-full items-center justify-center"}>
                <h1 className={"select-none font-semibold"}>课程表名称</h1>
                <Input className={"w-2/4"} placeholder="请输入课程表名称" value={name} onChange={(e) => {
                    setName(e.target.value)
                }}></Input>
            </div>
            <div className={"flex flex-row gap-2 w-full items-center justify-center"}>
                <h1 className={"select-none font-semibold"}>学期起始日期</h1>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-1/2 justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon/>
                            {date ? date.toLocaleDateString() : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date)=>setDate(date as Date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <Button className={"hover:cursor-pointer"} onClick={analyze}>添加此课程表</Button>
        </div>

    </div>
}