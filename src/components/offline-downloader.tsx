import {useEffect} from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {registerSW} from 'virtual:pwa-register';
import {toast} from "sonner";
import {LanguageAtom} from "@/store/language.ts";
import {useAtom} from "jotai";

function OfflineToast() {
    const language = useAtom(LanguageAtom)[0].language
    return <span
        className={"text-sm text-primary/70 font-semibold"}>{language['offline-downloader.offline-mode.toast.message']}</span>
}

export function OfflineDownloader() {
    useEffect(() => {

        registerSW({
            immediate: false,
            onOfflineReady() {
                toast(<OfflineToast/>)
            },
        });
    }, []);
    return <></>
}
