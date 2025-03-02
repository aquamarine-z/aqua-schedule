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

import {useAtom} from "jotai";
import {ScheduleInformationAtom} from "@/store/schedule.ts";
import {
    createEmptySchedule,
    ExternalInformationSwu,
    Schedule,
    ScheduleClass,
    scheduleMapDefaults
} from "@/constants/schedule-types.ts";
import {toast} from "sonner";

function parseClassScheduleSwu(scheduleString: string) {
    // 用于存储结果的数组

    // 使用正则表达式匹配节数范围
    const classPattern = /\((\d+)(?:-(\d+))?节\)/;
    const classMatch = scheduleString.match(classPattern);

    if (!classMatch) {
        console.error("无法读取此课程表 格式错误");
        return null;
    }

    // 解析节数范围
    const classIndexFrom = parseInt(classMatch[1], 10);
    const classIndexTo = classMatch[2] ? parseInt(classMatch[2], 10) : classIndexFrom;

    // 去掉节数部分，剩下周数部分
    const weeksPart = scheduleString.replace(classPattern, '').trim();

    // 分割周数部分
    const weekSegments = weeksPart.split(',');
    const weekIndex = [] as number[];
    // 解析每个周数段
    weekSegments.forEach(segment => {

        const weekPattern = /(\d+)(?:-(\d+))?周(?:\((单|双)\))?/;
        const weekMatch = segment.match(weekPattern);

        if (weekMatch) {
            const weekFrom = parseInt(weekMatch[1], 10);
            const weekTo = weekMatch[2] ? parseInt(weekMatch[2], 10) : weekFrom;
            const weekType = weekMatch[3]; // '单' 或 '双'，如果存在

            for (let i = weekFrom; i <= weekTo; i++) {
                // 如果有 '单' 或 '双' 标记，进行过滤
                if (weekType === '单' && i % 2 === 0) continue;
                if (weekType === '双' && i % 2 !== 0) continue;
                weekIndex.push(i);
            }
        } else {
            console.error("无法读取此课程表 格式错误");
            return null
        }
    });

    return {
        weekIndex:weekIndex,
        classIndexTo:classIndexTo,
        classIndexFrom:classIndexFrom,
    }
}

function extractSchedule(textContent: string) {
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

            let name = classElement.querySelector(".title")?.textContent || ""
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
                switch (span?.getAttribute("data-original-title")) {
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

            const classInformation = {
                name,
            } as ScheduleClass & ExternalInformationSwu
            const timeInformation=parseClassScheduleSwu(timeElement!)
            if(!timeInformation){
                console.error(classElement)
                return
            }
            classInformation.weekIndex = timeInformation.weekIndex
            classInformation.classIndexFrom = timeInformation.classIndexFrom
            classInformation.classIndexTo = timeInformation.classIndexTo
            
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
    const [scheduleInformation, setScheduleInformation] = useAtom(ScheduleInformationAtom)
    const analyze = async () => {
        if (scheduleInformation.schedules.map(it => it.name).includes(name)) {
            toast(<span className={"text-red-500"}>{"课程表名称重复!"}</span>)
            return
        }
        let textContent = ""
        try {
            const text = await navigator.clipboard.readText();
            //console.log('剪贴板的文本内容：', text);
            textContent = text
        } catch (err) {
            toast(<span className={"text-red-500"}>{'读取剪贴板内容时出错:' + err}</span>)
            return
        }
        //从defaultDomTree解析
        const resultArray = extractSchedule(textContent)
        if (!resultArray) {
            toast(<span className={"text-red-500"}>解析异常 请重试!</span>)
            return
        }
        if (confirm("解析完成 点击确认将其添加到课程表列表吗?")) {
            const schedule = createEmptySchedule()
            schedule.classes = resultArray
            schedule.name = name
            schedule.startTime = {
                year: date?.getFullYear().toString() || "2025",
                month: (date!.getMonth()! + 1 || 1).toString(),
                dayOfMonth: (date?.getDate() || 1).toString()
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            schedule.timeTable = scheduleMapDefaults.get("swu")!["timeTable"]!
            setScheduleInformation({
                ...scheduleInformation,
                schedules: [...scheduleInformation.schedules, schedule as Schedule]
            })
            toast("添加成功!")
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
                        <SelectValue placeholder="请选择课程时间表"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>课程时间表</SelectLabel>
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
                            {date ? date.toLocaleDateString() : <span>请选择日期</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => setDate(date as Date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <Button className={"hover:cursor-pointer"} onClick={analyze}>添加此课程表</Button>
        </div>

    </div>
}