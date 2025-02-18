import {LanguagePack} from "@/store/language.ts";
import {useAtom} from "jotai";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger} from "@/components/ui/select.tsx";
import {SelectValue} from "@radix-ui/react-select";
import {SettingsStorage} from "@/store/settings.ts";
import {Button} from "@/components/ui/button.tsx";
import {CirclePlusIcon, Trash2Icon} from "lucide-react";
import {Dialog, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {DialogClose} from "@radix-ui/react-dialog";
import {DialogContentWithoutClose} from "@/components/ui/dialog-content-without-close.tsx";
import {loadImageBase64} from "@/lib/file-utils.ts";

export function Settings() {
    const language = useAtom(LanguagePack)[0].language
    const [settings, setSettings] = useAtom(SettingsStorage)
    return <div
        className={"w-full h-full overflow-y-auto flex flex-col gap-8 pt-10 pb-10 pr-10 pl-10 items-center justify-start"}>
        <h1 className={"text-center text-primary text-2xl font-semibold"}>{language['settings.page-title']}</h1>
        <div className={"w-full flex flex-row gap-4 items-center"}>
            <span className={"text-primary font-bold text-lg min-w-fit"}> {language['settings.language.title']}</span>
            <Select defaultValue={settings.language} value={settings.language} onValueChange={(value) => {
                setSettings({...settings, language: value})
            }}>
                <SelectTrigger className="grow">
                    <SelectValue placeholder="Choose a language"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="zh-cn">简体中文</SelectItem>
                        <SelectItem value="jp">日本語</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <div className={"w-3/4 flex flex-col gap-4 items-center"}>
            <h1 className={"text-center text-primary text-lg font-semibold"}>
                {language['settings.background.title']}
            </h1>
            {settings.background.trim() === "" ?
                <h1 className={"font-semibold text-2xl mt-10 mb-10 text-center"}>{language['settings.background.no-background']}</h1> :
                <img src={settings.background} className={"rounded-2xl border-black border-2"}
                     alt={"background"}></img>}
            <div className={"w-full flex flex-row gap-4 items-center justify-around"}>
                {settings.background.trim() === "" || <Dialog>
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
                                    setSettings({...settings, background: ""})

                                }} variant={"destructive"}>
                                    {language['settings.background.remove.dialog.confirm']}
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogContentWithoutClose>
                </Dialog>
                }
                <Button onClick={() => {
                    loadImageBase64().then(base64 => {
                        setSettings({
                            ...settings,
                            background: base64 as string
                        })
                    })
                }}><CirclePlusIcon/>{language['settings.background.import']}</Button>
            </div>

        </div>
    </div>
}