import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {useLocation} from "react-router-dom";
import {ScheduleInformationAtom} from "@/store/schedule.ts";
import {useAtom} from "jotai";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    ArrowDownToLine,
    ArrowUpIcon,
    CircleArrowUpIcon,
    ClipboardIcon,
    ClipboardPen,
    DeleteIcon,
    MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";
import {useEffect, useRef, useState} from "react";

import defaultSchedule from "@/assets/se3_schedule.json";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Schedule} from "@/constants/schedule-types.ts";
import {toast} from "sonner";
import {saveStringToFile} from "@/lib/file-utils.ts";
import {AddClassDialog} from "@/components/add-class-dialog.tsx";
import {LanguageAtom} from "@/store/language.ts";
import {SettingsAtom} from "@/store/settings.ts";
import {useBackgroundSettings} from "@/store/backgrounds.ts";


export function AppTitleBar() {
    const location = useLocation()
    const [scheduleInformation, setScheduleInformation] = useAtom(ScheduleInformationAtom)
    const schedule = scheduleInformation.schedules[scheduleInformation.selectedIndex]
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [renameName, setRenameName] = useState("")
    const language = useAtom(LanguageAtom)[0].language
    const [settings,] = useAtom(SettingsAtom)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const autoChangeBackground: React.RefObject<never> = useRef<never>(undefined)
    useEffect(() => {
        if (scheduleInformation.selectedIndex >= scheduleInformation.schedules.length || scheduleInformation.selectedIndex < 0) {
            setScheduleInformation({...scheduleInformation, selectedIndex: 0})
        }
    }, [scheduleInformation.selectedIndex]);
    const backgroundSettings = useBackgroundSettings()
    useEffect(() => {
        const loadBackground = async () => {
            await backgroundSettings.loadBackgrounds()
        }
        loadBackground()

    }, []);
    useEffect(() => {
        if (!backgroundSettings.backgroundsLoaded) return
        if (settings.background.backgroundChangeMode === "auto-open" || settings.background.backgroundChangeMode === "auto-switch-view") {
            backgroundSettings.nextBackground()
            backgroundSettings.setLastSetBackgroundTime()
        }
        if (settings.background.backgroundChangeMode === "auto-time") {
            if (!autoChangeBackground.current) {
                if (backgroundSettings.checkChangeBackgroundTime()) {
                    backgroundSettings.nextBackground()
                    backgroundSettings.setLastSetBackgroundTime()
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                autoChangeBackground.current = setInterval(() => {
                    if (backgroundSettings.checkChangeBackgroundTime()) {
                        backgroundSettings.nextBackground()
                        backgroundSettings.setLastSetBackgroundTime()
                    }
                }, settings.background.backgroundAutoChangeTime * 60 * 1000 + 1000)
            }
        }
        //console.log(1)
        backgroundSettings.setBackgroundReady(true)
        return () => {
            if (autoChangeBackground.current) {
                clearInterval(autoChangeBackground.current)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                autoChangeBackground.current = undefined
            }
        }
    }, [settings.background.backgroundAutoChangeTime, backgroundSettings.backgroundsLoaded, settings.background.backgroundChangeMode]);
    const startDate = new Date()
    startDate.setMonth(parseInt(schedule.startTime.month))
    startDate.setDate(parseInt(schedule.startTime.dayOfMonth))
    startDate.setFullYear(parseInt(schedule.startTime.year))
    return <div className={"h-12 w-full shadow flex flex-row items-center gap-4 pr-4 pl-4"}>

        <SidebarTrigger className={"w-12 h-12 p-2 font-serif"}/>
        {location.pathname === "/" && <><span className={"font-semibold text-md text-gray-500"}>
                            {new Date().toLocaleDateString()}
                        </span><span
            className={"font-semibold text-md text-gray-500 text-ellipsis text-center"}>{language["title-bar.term-started"](startDate <= new Date())}</span>
            <span
                className={"font-semibold text-md text-gray-500 text-center"}>{language["title-bar.week-number"](scheduleInformation.viewingWeekIndex)}</span>
            <div className={"grow"}></div>
            <Popover open={popoverOpen} onOpenChange={open => setPopoverOpen(open)}>
                <PopoverTrigger asChild>
                    <Button onClick={() => setPopoverOpen(!popoverOpen)} variant="outline">{popoverOpen ?
                        <ArrowUpIcon/> : <MoreHorizontalIcon/>}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit max-w-[80vw] mr-2 ml-2 flex items-center flex-col gap-4">
                    <Dialog>
                        <DialogTrigger asChild className={"w-full"}>
                            <Button variant={"ghost"} className={"w-fit"}>
                                <div className={"w-full flex flex-row items-center justify-center"}>
                                    <ClipboardPen className={"w-1/4"}/>
                                    <span className={"w-3/4"}>
                                        {language['title-bar.popover.rename-button']}
                                    </span>
                                </div>

                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className={"w-3/4 h-3/8 flex flex-col justify-center items-center pb-2 pt-2 gap-10"}>
                            <DialogHeader>
                                <DialogTitle>
                                    <h1>{language['title-bar.dialog.rename.title']}</h1>
                                </DialogTitle>
                            </DialogHeader>
                            <Input className={"w-9/10"}
                                   placeholder={language["title-bar.dialog.rename.input.placeholder"]}
                                   value={renameName} onChange={e => {
                                setRenameName(e.target.value)
                            }}>

                            </Input>
                            <div className={"flex flex-row items-center justify-around w-full gap-2"}>
                                <DialogClose className={"w-[45%]"}>
                                    <Button className={"w-full"}
                                            variant={"secondary"}>{language['title-bar.dialog.rename.cancel']}</Button>
                                </DialogClose>
                                <DialogClose className={"w-[45%]"} onClick={() => {
                                    if (renameName === "") {
                                        toast(<span
                                            className={"text-red-500"}>{language["title-bar.dialog.rename.toast.name-empty"]}</span>)
                                        return
                                    }
                                    const newSchedules = [...scheduleInformation.schedules]
                                    newSchedules[scheduleInformation.selectedIndex].name = renameName
                                    setScheduleInformation({...scheduleInformation, schedules: newSchedules})
                                    toast(language["title-bar.dialog.rename.toast.rename-successfully"])
                                    setPopoverOpen(false)

                                }}>
                                    <Button className={"w-full"}>{language["title-bar.dialog.rename.confirm"]}</Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild className={"w-full"}>
                            <Button variant={"ghost"} className={"w-fit"}>
                                <div className={"w-full flex flex-row items-center justify-center"}>
                                    <CircleArrowUpIcon className={"w-1/4"}/>
                                    <span className={"w-3/4"}>
                                        {language['title-bar.popover.export-button']}
                                    </span>
                                </div>

                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className={"w-full text-primary font-semibold text-xl text-center"}>
                                    {language["title-bar.dialog.export.title"]}
                                </DialogTitle>
                            </DialogHeader>
                            <div className={"flex flex-row items-center justify-center gap-4"}>
                                <DialogClose onClick={() => {
                                    const schedule = scheduleInformation.schedules[scheduleInformation.selectedIndex]

                                    navigator.clipboard.writeText(JSON.stringify(schedule)).then(() => {
                                        toast(language["title-bar.dialog.export.to-clipboard.toast.export-successfully"], {
                                            description: schedule.name,
                                        })
                                    })
                                }}>
                                    <Button>
                                        <ClipboardIcon/>{language["title-bar.dialog.export.to-clipboard.button"]}
                                    </Button>

                                </DialogClose>
                                <DialogClose onClick={() => {
                                    const schedule = scheduleInformation.schedules[scheduleInformation.selectedIndex]
                                    saveStringToFile(`${schedule.name}.json`, JSON.stringify(schedule))
                                    toast(language["title-bar.dialog.export.to-file.toast.export-successfully"], {
                                        description: schedule.name,
                                    })
                                }}>
                                    <Button>
                                        <ArrowDownToLine/>{language["title-bar.dialog.export.to-file.button"]}
                                    </Button>

                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <AddClassDialog/>
                    <Dialog>
                        <DialogTrigger>
                            <Button variant="destructive" onClick={() => {
                            }}><DeleteIcon/>{language['title-bar.popover.delete-button']}</Button>
                        </DialogTrigger>
                        <DialogContent className={"flex flex-col items-center"}>
                            <DialogHeader className={"text-primary text-xl font-semibold"}>
                                {language['title-bar.dialog.delete.title']}
                            </DialogHeader>
                            <span className={"w-full text-center text-primary text-md font-semibold"}>
                                {language['title-bar.dialog.delete.message']}
                            </span>
                            <div className={"flex flex-row gap-2 w-full items-center justify-around"}>
                                <DialogClose className={"w-[45%]"}>
                                    <Button className={"w-full"} variant={'secondary'}>
                                        {language["title-bar.dialog.delete.cancel"]}
                                    </Button>
                                </DialogClose>
                                <DialogClose className={"w-[45%]"}>
                                    <Button className={"w-full"} variant={'destructive'} onClick={() => {
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
                                        toast(language["title-bar.dialog.delete.toast.delete-successfully"])
                                    }}>
                                        {language["title-bar.dialog.delete.confirm"]}
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>

                </PopoverContent>
            </Popover>

        </>
        }
    </div>
}