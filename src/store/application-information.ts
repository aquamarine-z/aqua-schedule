import {atom} from "jotai";

export interface ApplicationInformation{
    versionCode:string
    versionName?:string
}
export const ApplicationInformationAtom=atom({
    versionCode:"0.0.1",
    versionName:"Beta",
} as ApplicationInformation)