import {useAtom} from "jotai";
import {ScheduleInformation} from "@/store/schedule.ts";
import {useEffect, useState} from "react";
import backgroundSvg from "@/assets/background_default_2.png"
import * as React from "react";
import {createRoot} from "react-dom/client";

function formatWeeks(weeks: number[]) {
    if (!Array.isArray(weeks) || weeks.length === 0) {
        return '';
    }

    // 对数组进行排序
    weeks.sort((a, b) => a - b);

    const result = [];
    let start = weeks[0];
    let end = weeks[0];

    for (let i = 1; i < weeks.length; i++) {
        if (weeks[i] === end + 1) {
            // 当前数字与前一个数字连续
            end = weeks[i];
        } else {
            // 当前数字与前一个数字不连续
            if (start === end) {
                result.push(`${start}`);
            } else {
                result.push(`${start}~${end}`);
            }
            start = weeks[i];
            end = weeks[i];
        }
    }

    // 处理最后的区间
    if (start === end) {
        result.push(`${start}`);
    } else {
        result.push(`${start}~${end}`);
    }

    return result.join(',');
}

function getAllDatesOfTheWeek(date: Date, n: number) {
    n -= 1
    // 复制传入的日期，避免修改原日期
    const current = new Date(date);
    // 获取当前日期的星期（0: 周日, 1: 周一, ...）
    const day = current.getDay();
    // 计算本周周一与当前日期的差值
    // 如果当前日期是周日（day === 0），则将其视为上一周的最后一天，差值为 -6
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    // 计算出本周周一
    const monday = new Date(current);
    monday.setDate(current.getDate() + diffToMonday);

    // 将本周的周一加上 n 个星期（n*7 天）
    monday.setDate(monday.getDate() + n * 7);

    // 构造从周一到周日的日期数组
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekDates.push(d);
    }
    return weekDates;
}

const dayChineseName = ["日", "一", "二", "三", "四", "五", "六"]

function getDisplayTime(time: { hour: number, minute: number }) {
    const hour = time.hour
    const minute = time.minute
    return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute)
}

function showDialog(component: React.ReactNode) {

    if (document.body.getElementsByClassName("modal").length != 0) {
        return
    }
    const onClose = () => {
        document.body.style.overflow = ""
        document.body.removeChild(div)
    }
    const imageComponent = <div onClick={(e) => {
        e.stopPropagation()
        onClose()
    }}
                                className={"absolute z-[1000] left-0 top-0 h-[100vh] w-[100vw] backdrop-blur-sm bg-transparent flex items-center justify-center"}>
        {component}
    </div>
    const div = document.createElement("div")

    document.body.appendChild(div)
    document.body.style.overflow = "hidden"
    div.setAttribute("class", "modal")
    div.focus()
    const root = createRoot(div)
    root.render(imageComponent)
}

function showClassInformationDialog(information: {
    name: string;
    weekIndex?: number[];
    classIndexFrom?: number;
    classIndexTo?: number;
    weekday?: number;
    classLocation?: string;
    teachers?: string[];
    teachingClassName?: string;
    teachingClassComposition?: string;
    examinationType?: string;
    comment?: string;
    timeComposition?: string;
    weekTime?: number;
    totalTime?: number;
    point?: number;
    classType?: number;
}) {
    showDialog(<div
        onClick={(e) => {e.stopPropagation()}}
        className={" w-6/8 h-4/8 glass shadow-2xl bg-white rounded-2xl flex flex-col items-center backdrop-blur-xl gap-2 text-black p-2 noScrollBar overflow-y-scroll"}>
        <h1 className={"text-2xl font-semibold opacity-50 text-center "}>{information.name}</h1>
        <table className={"w-full table-fixed border-spacing-[8px] border-separate"}>
            <tbody>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>周数</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{formatWeeks(information.weekIndex!)} 周</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>上课时间</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>周{dayChineseName[information.weekday || 0]} {information.classIndexFrom}~{information.classIndexTo} 节</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>上课地点</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.classLocation}</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>教师</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.teachers?.join(",")}</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>学分</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.point}</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>考核形式</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.examinationType}</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>总学时</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.totalTime}</span>
                    </td>
                </tr>

                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>教学班名称</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.teachingClassName}</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>教学班组成</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.teachingClassComposition}</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>学时组成</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.timeComposition}</span>
                    </td>
                </tr>
                <tr>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>选课附加信息</span>
                    </td>
                    <td className={"text-lg font-semibold opacity-50 text-center"}>
                        <span>{information.comment?.trim() === "" ? "无" : information.comment}</span>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>)
}

export function ScheduleViewer() {
    const [scheduleInformation, setScheduleInformation] = useAtom(ScheduleInformation)
    const schedule = scheduleInformation.schedules[scheduleInformation.selectedIndex]
    const weekIndex = scheduleInformation.viewingWeekIndex
    const startTime = new Date()
    startTime.setMonth(parseInt(schedule.startTime.month))
    startTime.setDate(parseInt(schedule.startTime.dayOfMonth))
    startTime.setFullYear(parseInt(schedule.startTime.year))
    const dates = getAllDatesOfTheWeek(startTime, weekIndex)
    const [touchStartPosition, setTouchStartPosition] = useState({x: 0, y: 0})
    const touchMoveLength = 50
    const classTimes = schedule.classTimes
    useEffect(() => {
        const nowDate = new Date()
        //如果当前时间在学期开始时间之后，且在学期结束时间之前则自动跳转到当前周
        if (nowDate > startTime) {
            const weekIndex = Math.floor((nowDate.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1
            setScheduleInformation({...scheduleInformation, viewingWeekIndex: weekIndex})
        }
    }, [scheduleInformation.selectedIndex, scheduleInformation.schedules]);
    const moveWeek = (state: "left" | "right") => {
        if (state === "left") {
            if (weekIndex > 1) {
                setScheduleInformation({...scheduleInformation, viewingWeekIndex: weekIndex - 1})
            }
        }
        if (state === "right") {
            if (weekIndex < 20) {
                setScheduleInformation({...scheduleInformation, viewingWeekIndex: weekIndex + 1})
            }
        }
    }
    const getClass = (week: number, day: number, classIndex: number) => {
        let result = null
        schedule.schedule.forEach(classInformation => {
            //console.log(classInformation)
            if (classInformation.weekIndex.includes(week) && day === classInformation.weekday && classInformation.classIndexFrom <= classIndex && classInformation.classIndexTo >= classIndex) {
                result = classInformation as typeof classInformation
            }
        })
        return result as unknown as typeof schedule.schedule[0]
    }
    const tableTextStyle = "text-gray-200 opacity-70"
    return <div className={"relative w-full grow"}>
        <img className={"absolute left-0 top-0 w-full h-full -z-10"} src={backgroundSvg} alt={""}></img>
        <div className={"w-full h-full"}>
            <div
                onTouchEnd={(e) => {
                    const endPositionX = e.changedTouches[0].clientX
                    const deltaX = endPositionX - touchStartPosition.x
                    if (deltaX > touchMoveLength) {
                        moveWeek("left")
                    }
                    if (deltaX < -touchMoveLength) {
                        moveWeek("right")
                    }
                }}
                onTouchStart={(e) => {
                    setTouchStartPosition({x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY})
                }} className={"w-full h-full"}>
                <table className="w-full table-fixed border-spacing-[2px] border-separate">
                    <thead>
                        <tr>
                            <th className={"text-lg font-semibold " + tableTextStyle}>
                                {dates[0].getMonth()}月
                            </th>
                            {dates.map((date, index) => (
                                <th key={index} className="text-lg font-semibold">
                                    <div className="flex flex-col items-center justify-center+tableTextStyle">
                                        <span className={"" + tableTextStyle}>{dayChineseName[date.getDay()]}</span>
                                        <span className={"" + tableTextStyle}>{date.getDate()}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={"h-full"}>
                        {classTimes.map((classTime, index) => (
                            <tr key={index} className={"grow"}>
                                <td className={"flex flex-col items-center justify-around h-16 min-h-16 max-h-16"}>
                                    <p className={"text-[12px] select-none text-gray-100 opacity-85 font-semibold"}>{index + 1}</p>
                                    <p className={"text-[12px] select-none text-gray-100 opacity-85"}> {getDisplayTime(classTime.from)}</p>
                                    <p className={"text-[12px] select-none text-gray-100 opacity-85"}>{getDisplayTime(classTime.to)}</p>
                                </td>
                                {[1, 2, 3, 4, 5, 6, 7].map((day, dayIndex) => {
                                    const classInformation = getClass(weekIndex, day, index + 1)
                                    //console.log(weekIndex, day, index + 1)
                                    if (classInformation === null || classInformation === undefined) return <td
                                        key={dayIndex}></td>
                                    if (classInformation.classIndexFrom === index + 1) {
                                        return <td key={dayIndex}

                                                   onClick={() => {
                                                       showClassInformationDialog(classInformation)
                                                   }}
                                                   className={"h-full overflow-hidden shadow-2xl glass w-full rounded-lg "}
                                                   rowSpan={classInformation.classIndexTo - classInformation.classIndexFrom + 1}>
                                            <div
                                                className={"w-full max-h-full flex items-center flex-col justify-start p-1 gap-2"}>
                                                <p className={"text-[12px] text-center line-clamp-3 font-semibold text-gray-800 opacity-70"}>{classInformation.name}</p>
                                                <p className={"text-[12px] text-center line-clamp-3 font-semibold text-gray-800 opacity-70"}>{classInformation.classLocation}</p>
                                            </div>
                                        </td>
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    </div>


}