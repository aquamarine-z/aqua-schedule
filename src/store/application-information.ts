import {atom} from "jotai";

export interface ApplicationInformation{
    versionCode:string
    versionName?:string
}
export const ApplicationInformationAtom=atom({
    versionCode:"0.1.0",
    versionName:"Alpha",
} as ApplicationInformation)