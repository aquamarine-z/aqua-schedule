import swuSchedule from "@/assets/swu_schedule.json";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const scheduleMapDefaults = new Map<SchoolName, ClassTime[]>([['swu', swuSchedule]])
export type SchoolName="swu"
export class ScheduleClass {
    name: string = ""
    classIndexFrom: number = 0
    classIndexTo: number = 0
    
    weekIndex: number[] = []
    weekday: number = 0
    
    
    
    
}
export interface ExternalInformationSwu{
    teachers: string[]
    classLocation: string
    teachingClassName: string
    teachingClassComposition: string
    examinationType: string 
    comment: string
    timeComposition: string
    weekTime: number
    totalTime: number
    point: number
    classType: number
}

export interface ClassTime {
    from: { hour: number, minute: number }
    to: { hour: number, minute: number }
}

export class Schedule {
    classes: ScheduleClass[] = []
    timeTable: ClassTime[] = []
    schoolName:SchoolName="swu"
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

