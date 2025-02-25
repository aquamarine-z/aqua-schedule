import swuSchedule from "@/assets/swu_schedule.json";
import {z} from "zod"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const scheduleMapDefaults = new Map<SchoolName, ClassTime[]>([['swu', swuSchedule]])
export type SchoolName = "swu"
export const ScheduleClassSchema = z.object({
    name: z.string(),
    classIndexFrom: z.number(),
    classIndexTo: z.number(),
    weekIndex: z.array(z.number()),
    weekday: z.number()
})
export type ScheduleClass = z.infer<typeof ScheduleClassSchema>
export const ExternalInformationSwuSchema = z.object({
    teachers: z.array(z.string()).nullable(),
    classLocation: z.string().nullable(),
    teachingClassName: z.string().nullable(),
    teachingClassComposition: z.string().nullable(),
    examinationType: z.string().nullable(),
    comment: z.string().nullable(),
    timeComposition: z.string().nullable(),
    weekTime: z.number().nullable(),
    totalTime: z.number().nullable(),
    point: z.number().nullable(),
    classType: z.number().nullable()
})
export type ExternalInformationSwu = z.infer<typeof ExternalInformationSwuSchema>
export const ClassTimeSchema = z.object({
    from: z.object({
        hour: z.number(),
        minute: z.number()
    }),
    to: z.object({
        hour: z.number(),
        minute: z.number()
    })
})

export type ClassTime = z.infer<typeof ClassTimeSchema>
export const ScheduleSchema=z.object({
    classes: z.array(ScheduleClassSchema).nullable(),
    timeTable: z.array(ClassTimeSchema),
    schoolName: z.string(),
    startTime: z.object({
        year: z.string(),
        month: z.string(),
        dayOfMonth: z.string()
    }),
    name: z.string().nullable()
    
})
export type Schedule =z.infer<typeof ScheduleSchema>
export function createEmptySchedule(){
    return ScheduleSchema.parse(swuSchedule)
}
