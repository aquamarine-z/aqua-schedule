import {atom} from "jotai";
import zhCn from "@/locales/zh-cn.ts";
export const LanguageAtom = atom({
    language: zhCn,
    languageName: "zh-cn"
})