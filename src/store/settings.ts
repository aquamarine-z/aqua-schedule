import {atomWithStorage} from "jotai/utils";
//import {focusAtom} from "jotai-optics";

export type Settings = {
    background: {
        backgroundChangeMode: "auto-time" | "auto-open" | "by-user"|"auto-switch-view",
        backgroundAutoChangeTime: number,
        backgroundLastChangeTime: number,
        backgroundCurrentIndex: number,
        backgroundSelectMethod: "random" | "loop",
    },
    language: "en" | "zh-cn" | "jp"
}
export const SettingsAtom = atomWithStorage("settings", {
        background: {
            backgroundChangeMode: "auto-switch-view" as "auto-time" | "auto-open" | "by-user"|"auto-switch-view",
            backgroundAutoChangeTime: 60,
            backgroundLastChangeTime: new Date().getTime(),
            backgroundCurrentIndex: 0,
            backgroundSelectMethod: "random" as "random" | "loop",
        },
        language: "en"
    } as Settings,
)
//export const SettingsBackgroundAtom = focusAtom(SettingsAtom, optic => optic.prop("backgroundSettings") as Settings)