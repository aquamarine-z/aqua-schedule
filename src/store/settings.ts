import {atomWithStorage} from "jotai/utils";

export const SettingsStorage=atomWithStorage("settings",{
    background:"",
    language:"en"
})