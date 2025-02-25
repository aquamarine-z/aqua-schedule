import {useAtom} from "jotai";
import {ScheduleInformationAtom} from "@/store/schedule.ts";
import {useEffect, useState} from "react";
import backgroundSvg from "@/assets/background_default_2.png"
import {ClassInformationDisplay} from "@/pages/schedule_viewer/ClassInformationDisplay.tsx";
import {ScheduleClass, scheduleMapDefaults, SchoolName} from "@/constants/schedule-types.ts";
import {getAllDatesOfTheWeek} from "@/lib/time-utils.ts";
import {LanguageAtom} from "@/store/language.ts";
import {isBase64Image} from "@/lib/file-utils.ts";
import {useBackgroundSettings} from "@/store/backgrounds.ts";
import {SettingsAtom} from "@/store/settings.ts";

function getDisplayTime(time: { hour: number, minute: number }) {
    const hour = time.hour
    const minute = time.minute
    return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute)
}

export function ScheduleViewer() {
    const [scheduleInformation, setScheduleInformation] = useAtom(ScheduleInformationAtom)
    const schedule = scheduleInformation.schedules[scheduleInformation.selectedIndex]
    const weekIndex = scheduleInformation.viewingWeekIndex
    const startTime = new Date()
    const [settings,] = useAtom(SettingsAtom)
    //const [settings] = useAtom(SettingsAtom)
    startTime.setMonth(parseInt(schedule.startTime.month) - 1)
    startTime.setDate(parseInt(schedule.startTime.dayOfMonth))
    startTime.setFullYear(parseInt(schedule.startTime.year))
    const dates = getAllDatesOfTheWeek(startTime, weekIndex)
    const [touchStartPosition, setTouchStartPosition] = useState({x: 0, y: 0})
    const touchMoveXMinimum = 30
    const touchMoveYMaximum = 70
    let timeTable = schedule.timeTable
    if (!timeTable || !Array.isArray(timeTable)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        timeTable = scheduleMapDefaults["swu"]!['timeTable']
    }
    const classesInThisWeek = schedule.classes?.filter(classInformation => {
        return classInformation.weekIndex.includes(weekIndex)
    })

    const language = useAtom(LanguageAtom)[0].language

    useEffect(() => {
        const nowDate = new Date()
        //如果当前时间在学期开始时间之后，且在学期结束时间之前则自动跳转到当前周
        if (nowDate > startTime) {
            const weekIndex = Math.floor((nowDate.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1
            setScheduleInformation(prev => {
                return {...prev, viewingWeekIndex: weekIndex}
            })
        }
    }, []);

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

        classesInThisWeek?.forEach(classInformation => {

            if (classInformation.weekIndex.includes(week) && day === classInformation.weekday && classInformation.classIndexFrom <= classIndex && classInformation.classIndexTo >= classIndex) {
                result = classInformation as ScheduleClass
            }
        })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return result as unknown as typeof schedule.classes[0]
    }
    const tableTextStyle = "text-gray-200/70"
    const backgroundSettings = useBackgroundSettings()
    useEffect(() => {
        if (!backgroundSettings.backgroundsLoaded) return
        if (settings.background.backgroundChangeMode === "auto-switch-view") {
            backgroundSettings.nextBackground()
            backgroundSettings.setBackgroundReady(true)
        }
        return () => {
            backgroundSettings.setBackgroundReady(false)
        }
    }, [settings.background.backgroundChangeMode, scheduleInformation.selectedIndex]);
    if (!backgroundSettings.backgroundReady) return <></>

    const background = backgroundSettings.nowBackground()
    return <div className={"relative w-full h-full select-none"}>
        <img className={"absolute left-0 top-0 w-full h-full -z-10"}
             src={isBase64Image(background) ? background : backgroundSvg} alt={""}></img>
        <div className={"relative w-full h-full pt-2 pb-2 "}>
            <table className="w-full table-fixed h-12 border-spacing-[2px] border-separate overflow-y-auto">
                <thead className={"h-12 sticky"}>
                    <tr>
                        <th className={"text-lg font-semibold " + tableTextStyle}>
                            {language["schedule-viewer.month"](dates[0].getMonth() + 1)}
                        </th>
                        {dates.map((date, index) => (
                            <th key={index} className="text-lg font-semibold">
                                <div className="flex flex-col items-center justify-center+tableTextStyle">
                                    <span
                                        className={"" + tableTextStyle}>{language['schedule-viewer.weekday'](date.getDay())}</span>
                                    <span className={"" + tableTextStyle}>{date.getDate()}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>
            <div className={"w-full h-[calc(100vh-theme(spacing.24))] overflow-y-auto noScrollBar"}>
                <table
                    onTouchEnd={(e) => {
                        const endPositionX = e.changedTouches[0].clientX
                        const endPositionY = e.changedTouches[0].clientY
                        const deltaX = endPositionX - touchStartPosition.x
                        const deltaY = endPositionY - touchStartPosition.y
                        if (Math.abs(deltaY) > touchMoveYMaximum) return
                        if (deltaX > touchMoveXMinimum) {
                            moveWeek("left")
                        }
                        if (deltaX < -touchMoveXMinimum) {
                            moveWeek("right")
                        }
                    }}
                    onTouchStart={(e) => {
                        setTouchStartPosition({x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY})
                    }}
                    className="w-full table-fixed h-fit border-spacing-[2px] border-separate mb-8">
                    <thead className={"h-0"}>
                        <tr>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                        </tr>
                    </thead>
                    <tbody>
                        {timeTable.map((classTime, index) => (
                            <tr key={index} className={""}>
                                <td className={"flex flex-col items-center justify-around h-16 min-h-16 max-h-16"}>
                                    <p className={"text-[12px] select-none text-gray-100 opacity-85 font-semibold"}>{index + 1}</p>
                                    <p className={"text-[12px] select-none text-gray-100 opacity-85"}> {getDisplayTime(classTime.from)}</p>
                                    <p className={"text-[12px] select-none text-gray-100 opacity-85"}>{getDisplayTime(classTime.to)}</p>
                                </td>
                                {[1, 2, 3, 4, 5, 6, 7].map((day, dayIndex) => {
                                    const classInformation = getClass(weekIndex, day, index + 1)
                                    return <ClassInformationDisplay classIndex={index + 1} key={dayIndex}
                                                                    dayIndex={dayIndex}
                                                                    classInformation={classInformation}
                                                                    schoolName={schedule.schoolName as SchoolName}/>
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </div>
    </div>


}