import {ExternalInformationSwu, ScheduleClass, SchoolName} from "@/constants/schedule-types.ts";
import {dayChineseName, formatWeeks} from "@/lib/time-utils.ts";

function dialogInformationExtractorDefault(information: ScheduleClass): Map<string, string> {
    const result = new Map<string, string>()
    result.set("课程名称", information.name)
    result.set("周数", formatWeeks(information.weekIndex!) + " 周")
    result.set("上课时间", `周${dayChineseName[information.weekday || 0]} ${information.classIndexFrom}~${information.classIndexTo} 节`)
    return result
}
function dialogInformationExtractorForSwu(information: ScheduleClass): Map<string, string> {
    const result = new Map()
    const info = information as (ScheduleClass & ExternalInformationSwu)
    result.set("周数", formatWeeks(info.weekIndex!) + " 周")
    result.set("上课时间", `周${dayChineseName[information.weekday || 0]} ${information.classIndexFrom}~${information.classIndexTo} 节`)
    result.set("上课地点", info.classLocation)
    result.set("教师", info.teachers?.join(","))
    result.set("学分", info.point)
    result.set("考核形式", info.examinationType)
    result.set("总学时", info.totalTime)
    result.set("教学班名称", info.teachingClassName)
    result.set("教学班组成", info.teachingClassComposition)
    result.set("学时组成", info.timeComposition)
    result.set("选课附加信息", (!info.comment || info.comment.trim() === "") ? "无" : info.comment)

    return result
}

function blockInformationExtractorForSwu(information: ScheduleClass): Array<string> {
    const info = information as (ScheduleClass & ExternalInformationSwu)
    return [info.name, info.classLocation]
}

function blockInformationExtractorDefault(information: ScheduleClass): Array<string> {
    return [information.name]
}

export const dialogInformationExtractors: Map<SchoolName | "default", (information: ScheduleClass) => Map<string, string>> = new Map([
    ["swu", dialogInformationExtractorForSwu],
    ["default", dialogInformationExtractorDefault]
])
export const blockInformationExtractors: Map<SchoolName | "default", (information: ScheduleClass) => Array<string>> = new Map([
    ["swu", blockInformationExtractorForSwu],
    ['default', blockInformationExtractorDefault]
])

export function getExtractorByName(name?: SchoolName | "default"): [(information: ScheduleClass) => Array<string>, (information: ScheduleClass) => Map<string, string>] {
    return [blockInformationExtractors.get(name ?? "default")!, dialogInformationExtractors.get(name ?? "default")!]
}