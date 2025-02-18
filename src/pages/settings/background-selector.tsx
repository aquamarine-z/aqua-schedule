import {useAtom} from "jotai/index";
import {LanguagePack} from "@/store/language.ts";
import {SettingsStorage} from "@/store/settings.ts";
import * as React from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel.tsx";
import {useEffect} from "react";
import {Dialog, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CirclePlusIcon, RotateCcw, Trash2Icon} from "lucide-react";
import {DialogContentWithoutClose} from "@/components/ui/dialog-content-without-close.tsx";
import {DialogClose} from "@radix-ui/react-dialog";
import {loadImagesBase64} from "@/lib/file-utils.ts";
import {toast} from "sonner";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";


export function BackgroundSelector() {
    const language = useAtom(LanguagePack)[0].language
    const [settings, setSettings] = useAtom(SettingsStorage)
    const [api, setApi] = React.useState<CarouselApi>()
    const [currentSelectedBackgroundIndex, setCurrentSelectedBackgroundIndex] = React.useState<number>(settings.backgroundSettings.backgroundCurrentIndex)
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
    return (<div className={"w-3/4 flex flex-col gap-4 items-center"}>
        <h1 className={"text-center text-primary text-lg font-semibold"}>
            {language['settings.background.title']}
        </h1>
        <Carousel opts={{}} setApi={setApi}>
            <CarouselContent>
                {settings.backgroundSettings.backgrounds.length === 0 ?
                    <CarouselItem>
                        <div
                            className={"w-[75vw] h-[55vh] object-cover rounded-2xl border-black border-2 flex items-center justify-center"}>
                            <h1>{language["settings.background.no-background"]}</h1>
                        </div>
                    </CarouselItem>
                    : settings.backgroundSettings.backgrounds.map((it, index) => {
                        return <CarouselItem key={index}>
                            <img className={"w-[75vw] h-[55vh] object-cover rounded-2xl border-black border-2"}
                                 src={it} alt={""}/>
                        </CarouselItem>
                    })}
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>
        </Carousel>
        <div className={"w-full flex flex-row gap-4 items-center justify-around"}>
            {settings.backgroundSettings.backgrounds.length === 0 || <Dialog>
                <DialogTrigger>
                    <Button variant={"destructive"}><Trash2Icon/>{language['settings.background.remove']}</Button>
                </DialogTrigger>
                <DialogContentWithoutClose className={"items-center flex flex-col justify-start pt-4"}>
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
                            <Button onClick={() => {
                                const newBackgrounds = [...settings.backgroundSettings.backgrounds.filter((_, i) => {
                                    return i !== currentSelectedBackgroundIndex
                                })]
                                setSettings({
                                    ...settings, backgroundSettings: {
                                        ...settings.backgroundSettings,
                                        backgrounds: newBackgrounds
                                    }
                                })
                                if (newBackgrounds.length === 0) {
                                    setCurrentSelectedBackgroundIndex(-1)
                                }
                                toast(language['settings.background.toast.remove-successfully'])

                            }} variant={"destructive"}>
                                {language['settings.background.remove.dialog.confirm']}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContentWithoutClose>
            </Dialog>
            }
            <Button onClick={() => {
                loadImagesBase64().then((base64) => {
                    setSettings({
                        ...settings,
                        backgroundSettings: {
                            ...settings.backgroundSettings,
                            backgrounds: [...settings.backgroundSettings.backgrounds,... base64 as string[]]
                        }

                    })
                    toast(language['settings.background.toast.import-successfully'])
                })
            }}><CirclePlusIcon/>{language['settings.background.import']}</Button>
        </div>
        {
            settings.backgroundSettings.backgrounds.length > 0 &&
            <div className={"w-full flex flex-col gap-1 items-start"}>
                <Label>{language['settings.background.change.mode.label']}</Label>
                <Select value={settings.backgroundSettings.backgroundChangeMode} onValueChange={v => {
                    setSettings(async prev => {
                        const settings = await prev
                        return {
                            ...settings,
                            backgroundSettings: {
                                ...settings.backgroundSettings,
                                backgroundChangeMode: v as typeof settings.backgroundSettings.backgroundChangeMode
                            }
                        }
                    })
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder=""/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            value="auto-time">{language['settings.background.change.mode.auto-time']}</SelectItem>
                        <SelectItem
                            value="auto-open">{language['settings.background.change.mode.auto-open']}</SelectItem>
                        <SelectItem
                            value="by-user">{language['settings.background.change.mode.by-user']}</SelectItem>
                    </SelectContent>
                </Select>
                {
                    (settings.backgroundSettings.backgroundChangeMode === "auto-time" || settings.backgroundSettings.backgroundChangeMode === "auto-open") && <>
                        <Label>
                            {language["settings.background.select.mode.label"]}
                        </Label>
                        <Select value={settings.backgroundSettings.backgroundSelectMethod} onValueChange={v => {
                            setSettings(async prev => {
                                const settings = await prev
                                return {
                                    ...settings,
                                    backgroundSettings: {
                                        ...settings.backgroundSettings,
                                        backgroundSelectMethod: v as typeof settings.backgroundSettings.backgroundSelectMethod
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
                            settings.backgroundSettings.backgroundChangeMode === "auto-time" && <>
                                <Label>{language["settings.background.change-time"]}</Label>
                                <Input type={"number"} value={settings.backgroundSettings.backgroundAutoChangeTime}
                                       onChange={v => {
                                           const value = parseInt(v.target.value)
                                           if (value.toString(10) !== "" && value > 0) {
                                               setSettings(async prev => {
                                                   const settings = await prev
                                                   return {
                                                       ...settings,
                                                       backgroundSettings: {
                                                           ...settings.backgroundSettings,
                                                           backgroundAutoChangeTime: value
                                                       }
                                                   }
                                               })
                                           }
                                       }}/>
                            </>
                        }
                        <Button className={"w-full"} variant={"secondary"} onClick={() => {
                            setSettings(async prev => {
                                const settings = await prev
                                return {
                                    ...settings,
                                    backgroundSettings: {
                                        ...settings.backgroundSettings,
                                        backgroundLastChangeTime: new Date().getTime(),
                                        backgroundCurrentIndex: currentSelectedBackgroundIndex
                                    }
                                }
                            })
                            toast(language['settings.background.button.select.toast.message'])
                        }}><RotateCcw/>{language['settings.background.button.select']}</Button>
                        <Button className={"w-full"} variant={'secondary'} onClick={() => {
                            let nextIndex = 0
                            if (settings.backgroundSettings.backgroundSelectMethod === "random") {
                                nextIndex = Math.floor(Math.random() * settings.backgroundSettings.backgrounds.length)
                            } else if (settings.backgroundSettings.backgroundSelectMethod === "loop") {
                                if (currentSelectedBackgroundIndex === settings.backgroundSettings.backgrounds.length - 1) nextIndex = 0
                                else nextIndex = currentSelectedBackgroundIndex + 1
                            }
                            setSettings(async prev => {
                                const settings = await prev
                                return {
                                    ...settings,
                                    backgroundSettings: {
                                        ...settings.backgroundSettings,
                                        backgroundLastChangeTime: new Date().getTime(),
                                        backgroundCurrentIndex: nextIndex
                                    }
                                }
                            })
                            setCurrentSelectedBackgroundIndex(nextIndex)
                            toast(language['settings.background.button.change.toast.message'])
                            //console.log(nextIndex)
                        }}><RotateCcw/>{language['settings.background.button.change']}</Button>
                    </>
                }
                {
                    settings.backgroundSettings.backgroundChangeMode === "by-user" && <>
                        <Button className={"w-full"} onClick={() => {
                            setSettings(async prev => {
                                const settings = await prev
                                return {
                                    ...settings,
                                    backgroundSettings: {
                                        ...settings.backgroundSettings,
                                        backgroundCurrentIndex: currentSelectedBackgroundIndex
                                    }
                                }
                            })
                        }}>{language['settings.background.by-user.button.select']}</Button>
                    </>
                }
            </div>
        }
    </div>)
}