import {useEffect} from "react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {useAtom} from "jotai";
import {LanguageAtom} from "@/store/language.ts";
import {Download, X} from "lucide-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {registerSW} from 'virtual:pwa-register';

function UpdateToast(props: { onUpdate: () => void }) {
    const language = useAtom(LanguageAtom)[0].language
    return <div className={"w-full flex flex-row items-center justify-start"}>
        <span className={"text-sm text-primary/70 font-semibold"}>{language["update-checker.message"]}</span>
        <div className={"grow"}/>
        <Dialog modal>
            <DialogTrigger asChild>
                <Button className={"font-semibold h-3/4 p-1.5 "}><Download/>{language['update-checker.button']}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={"text-lg text-primary/70 font-bold"}>
                        {language['update-checker.dialog.title']}
                    </DialogTitle>
                </DialogHeader>
                <span className={"text-md text-primary/70 font-semibold text-center"}>
                    {language["update-checker.dialog.message"]}
                </span>
                <div className={" flex flex-row ml-[15%] mr-[15%] items-center justify-center gap-4"}>
                    <DialogClose className={"w-4/8"}>

                        <Button className={"font-semibold w-full"}
                                variant={"secondary"}><X/>{language['update-checker.dialog.cancel']}</Button>

                    </DialogClose>
                    <DialogClose className={"w-4/8"} onClick={props.onUpdate}>
                        <Button
                            className={"font-semibold w-full"}><Download/>{language['update-checker.dialog.confirm']}
                        </Button>
                    </DialogClose>

                </div>
            </DialogContent>
        </Dialog>

    </div>
}

export function UpdateChecker() {
    useEffect(() => {
        //console.log('New service worker activated. Refreshing page...');
        console.log('Checking for new updates...');
        const updateSW = registerSW({
            onNeedRefresh() {
                toast(<UpdateToast onUpdate={async () => {
                    await updateSW(true)
                }}/>)
            }
        })
       
    }, [])
    return <></>
}