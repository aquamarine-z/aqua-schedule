import enLanguage from "@/locales/en.ts"
import {atom} from "jotai";
export const LanguageAtom = atom({
    language: enLanguage,
    languageName: "en"
})