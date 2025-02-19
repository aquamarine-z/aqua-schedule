import {atomWithStorage} from "jotai/utils";
//import {focusAtom} from "jotai-optics";

export type Settings = {
    backgroundSettings: {
        backgroundChangeMode: "auto-time" | "auto-open" | "by-user",
        backgroundAutoChangeTime: number,
        backgroundLastChangeTime: number,
        backgroundCurrentIndex: number,
        backgroundSelectMethod: "random" | "loop",
    },
    language: "en" | "zh-cn" | "jp"
}
export const SettingsAtom = atomWithStorage("settings", {
        backgroundSettings: {
            backgroundChangeMode: "auto-open" as "auto-time" | "auto-open" | "by-user",
            backgroundAutoChangeTime: 60,
            backgroundLastChangeTime: new Date().getTime(),
            backgroundCurrentIndex: 0,
            backgroundSelectMethod: "random" as "random" | "loop",
        },
        language: "en"
    } as Settings,
)
//export const SettingsBackgroundAtom = focusAtom(SettingsAtom, optic => optic.prop("backgroundSettings") as Settings)