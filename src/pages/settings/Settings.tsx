import {LanguagePack} from "@/store/language.ts";
import {useAtom} from "jotai";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger} from "@/components/ui/select.tsx";
import {SelectValue} from "@radix-ui/react-select";
import {SettingsStorage} from "@/store/settings.ts";
import {BackgroundSelector} from "@/pages/settings/background-selector.tsx";

export function Settings() {
    const language = useAtom(LanguagePack)[0].language
    const [settings, setSettings] = useAtom(SettingsStorage)
    
    return <div
        className={"w-full h-full overflow-y-scroll noScrollBar flex flex-col gap-8 pt-10 pb-10 pr-10 pl-10 items-center justify-start"}>
        <h1 className={"text-center text-primary text-2xl font-semibold"}>{language['settings.page-title']}</h1>
        <div className={"w-full flex flex-row gap-4 items-center"}>
            <span className={"text-primary font-bold text-lg min-w-fit"}> {language['settings.language.title']}</span>
            <Select defaultValue={settings.language} value={settings.language} onValueChange={(value) => {
                setSettings(async prev => {
                    const settings = await prev
                    return {...settings, language: value}
                }
                
            )
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
        <BackgroundSelector/>
    </div>
}