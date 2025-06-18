import {useAtom} from "jotai/index";
import {LanguageAtom} from "@/store/language.ts";
import {SettingsAtom} from "@/store/settings.ts";
import * as React from "react";
import {useEffect} from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel.tsx";
import {Dialog, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronsUpDown, CirclePlusIcon, RotateCcw, Trash2Icon} from "lucide-react";
import {ExtendedDialogContent} from "@/components/ui/dialog-extensions.tsx";
import {DialogClose} from "@radix-ui/react-dialog";
import {loadImagesBase64} from "@/lib/file-utils.ts";
import {toast} from "sonner";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {BackgroundsAtom, useBackgroundSettings} from "@/store/backgrounds.ts";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";


export function BackgroundSelector() {
    const language = useAtom(LanguageAtom)[0].language
    const [settings, setSettings] = useAtom(SettingsAtom)
    const [api, setApi] = React.useState<CarouselApi>()
    const backgroundSettings = useBackgroundSettings()
    const [backgrounds, setBackgrounds] = useAtom(BackgroundsAtom)
    
    const [currentSelectedBackgroundIndex, setCurrentSelectedBackgroundIndex] = React.useState<number>(settings.background.backgroundCurrentIndex)
    useEffect(() => {
        if (!api) {
            return
        }
        api.on("init", () => {
            api.scrollTo(currentSelectedBackgroundIndex)
        })
        api.on("select", () => {
            setCurrentSelectedBackgroundIndex(api.selectedScrollSnap())
        })

    }, [api])
    useEffect(() => {
        if (!api) return
        api.scrollTo(currentSelectedBackgroundIndex)
    }, [currentSelectedBackgroundIndex]);

    return <Collapsible className={"w-full"} defaultOpen={true}>
        <CollapsibleTrigger className={"w-full items-center justify-center flex flex-row gap-0"}>
            <Button variant={"outline"}
            ><Label className={"text-primary font-semibold text-lg"}>
                {language['settings.background.title']}
            </Label><ChevronsUpDown
                className=""/></Button>
        </CollapsibleTrigger>
        <CollapsibleContent className={"w-full flex items-center justify-center transition pt-4 pb-4"}>
            <div className={"w-3/4 flex flex-col gap-4 items-center"}>
                <Carousel opts={{}} setApi={setApi}>
                    <CarouselContent>
                        {backgrounds.length === 0 ?
                            <CarouselItem>
                                <div
                                    className={"w-[75vw] h-[55vh] object-cover rounded-2xl border-black border-2 flex items-center justify-center"}>
                                    <h1>{language["settings.background.no-background"]}</h1>
                                </div>
                            </CarouselItem>
                            : backgrounds.map((it, index) => {
                                return <CarouselItem key={index}>
                                    <img
                                        className={"w-[75vw] h-[55vh] object-cover rounded-2xl border-black border-2"}
                                        src={it} alt={""}/>
                                </CarouselItem>
                            })}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
                <div className={"w-full flex flex-row gap-4 items-center justify-around"}>
                    {backgrounds.length === 0 || <Dialog>
                        <DialogTrigger>
                            <Button variant={"destructive"}><Trash2Icon/>{language['settings.background.remove']}
                            </Button>
                        </DialogTrigger>
                        <ExtendedDialogContent className={"items-center flex flex-col justify-start pt-4"}>
                            <DialogHeader>
                                <DialogTitle className={"font-semibold text-2xl text-primary"}>
                                    {language["settings.background.remove.dialog.title"]}
                                </DialogTitle>

                            </DialogHeader>
                            <span
                                className={"font-medium text-md text-primary"}>{language['settings.background.remove.dialog.message']}</span>
                            <div className={"flex flex-row gap-6 w-full items-center justify-center"}>
                                <DialogClose>
                                    <Button
                                        variant={"secondary"}>{language['settings.background.remove.dialog.cancel']}</Button>
                                </DialogClose>
                                <DialogClose>
                                    <Button onClick={async () => {
                                        const newBackgrounds = backgrounds.filter((_, index) => index !== currentSelectedBackgroundIndex)
                                        await setBackgrounds(newBackgrounds)
                                        if (newBackgrounds.length === 0) {
                                            setCurrentSelectedBackgroundIndex(-1)
                                        }
                                        toast(language['settings.background.toast.remove-successfully'])

                                    }} variant={"destructive"}>
                                        {language['settings.background.remove.dialog.confirm']}
                                    </Button>
                                </DialogClose>
                            </div>
                        </ExtendedDialogContent>
                    </Dialog>
                    }
                    <Button onClick={async () => {
                        loadImagesBase64().then((base64) => {
                            (base64 as string[]).forEach(async (it) => {
                                await backgroundSettings.appendBackground(it)
                            })
                            toast(language['settings.background.toast.import-successfully'])
                        })
                    }}><CirclePlusIcon/>{language['settings.background.import']}</Button>
                </div>
                {
                    backgrounds.length > 0 &&
                    <div className={"w-full flex flex-col gap-1 items-start"}>
                        <Label
                            className={"font-semibold text-sm text-primary/70"}>{language['settings.background.change.mode.label']}</Label>
                        <Select value={settings.background.backgroundChangeMode} onValueChange={v => {
                            setSettings(prev => {
                                const settings = prev
                                return {
                                    ...settings,
                                    background: {
                                        ...settings.background,
                                        backgroundChangeMode: v as typeof settings.background.backgroundChangeMode
                                    }
                                }
                            })
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder=""/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="auto-open">{language['settings.background.change.mode.auto-open']}</SelectItem>
                                <SelectItem
                                    value="auto-switch-view">{language['settings.background.change.mode.auto-switch-view']}</SelectItem>
                                <SelectItem
                                    value="auto-time">{language['settings.background.change.mode.auto-time']}</SelectItem>

                                <SelectItem
                                    value="by-user">{language['settings.background.change.mode.by-user']}</SelectItem>
                            </SelectContent>
                        </Select>
                        {
                            (settings.background.backgroundChangeMode === "auto-time" || settings.background.backgroundChangeMode === "auto-switch-view" || settings.background.backgroundChangeMode === "auto-open") && <>
                                <Label className={"font-semibold text-sm text-primary/70"}>
                                    {language["settings.background.select.mode.label"]}
                                </Label>
                                <Select value={settings.background.backgroundSelectMethod} onValueChange={v => {
                                    setSettings(prev => {
                                        const settings = prev
                                        return {
                                            ...settings,
                                            background: {
                                                ...settings.background,
                                                backgroundSelectMethod: v as typeof settings.background.backgroundSelectMethod
                                            }
                                        }
                                    })
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder=""/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="random">{language['settings.background.select.mode.random']}</SelectItem>
                                        <SelectItem
                                            value="loop">{language['settings.background.select.mode.loop']}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {
                                    settings.background.backgroundChangeMode === "auto-time" && <>
                                        <Label
                                            className={"font-semibold text-sm text-primary/70"}>{language["settings.background.change-time"]}</Label>
                                        <Input type={"number"} value={settings.background.backgroundAutoChangeTime}
                                               onChange={v => {
                                                   const value = parseInt(v.target.value)
                                                   if (value.toString(10) !== "" && value > 0) {
                                                       setSettings(prev => {
                                                           const settings = prev
                                                           return {
                                                               ...settings,
                                                               background: {
                                                                   ...settings.background,
                                                                   backgroundAutoChangeTime: value
                                                               }
                                                           }
                                                       })
                                                   }
                                               }}/>
                                    </>
                                }
                                <div className={"w-full mt-4 flex flex-col gap-4 items-center"}>
                                    <Button className={"w-7/8"} variant={"secondary"} onClick={() => {
                                        setSettings(prev => {
                                            const settings = prev
                                            return {
                                                ...settings,
                                                background: {
                                                    ...settings.background,
                                                    backgroundLastChangeTime: new Date().getTime(),
                                                    backgroundCurrentIndex: currentSelectedBackgroundIndex
                                                }
                                            }
                                        })
                                        toast(language['settings.background.button.select.toast.message'])
                                    }}><RotateCcw/>{language['settings.background.button.select']}</Button>
                                    <Button className={"w-7/8"} variant={'secondary'} onClick={() => {
                                        let nextIndex = 0
                                        if (settings.background.backgroundSelectMethod === "random") {
                                            nextIndex = Math.floor(Math.random() * backgrounds.length)
                                        } else if (settings.background.backgroundSelectMethod === "loop") {
                                            if (currentSelectedBackgroundIndex === backgrounds.length - 1) nextIndex = 0
                                            else nextIndex = currentSelectedBackgroundIndex + 1
                                        }
                                        setSettings(prev => {
                                            const settings = prev
                                            return {
                                                ...settings,
                                                background: {
                                                    ...settings.background,
                                                    backgroundLastChangeTime: new Date().getTime(),
                                                    backgroundCurrentIndex: nextIndex
                                                }
                                            }
                                        })
                                        setCurrentSelectedBackgroundIndex(nextIndex)
                                        toast(language['settings.background.button.change.toast.message'])
                                        //console.log(nextIndex)
                                    }}><RotateCcw/>{language['settings.background.button.change']}</Button>
                                </div>

                            </>
                        }
                        {
                            settings.background.backgroundChangeMode === "by-user" &&
                            <div className={"w-full flex flex-col items-center pt-2"}>
                                <Button className={"w-7/8"} onClick={() => {
                                    setSettings(prev => {
                                        const settings = prev
                                        return {
                                            ...settings,
                                            background: {
                                                ...settings.background,
                                                backgroundCurrentIndex: currentSelectedBackgroundIndex
                                            }
                                        }
                                    })
                                }}>{language['settings.background.by-user.button.select']}</Button>
                            </div>
                        }
                    </div>
                }
            </div>
        </CollapsibleContent>
    </Collapsible>
}