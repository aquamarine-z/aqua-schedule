import {
    Dialog, DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CirclePlusIcon} from "lucide-react";
import {LanguagePack} from "@/store/language.ts";
import {useAtom} from "jotai";


export function AddClassDialog() {
    const language=useAtom(LanguagePack)[0].language
    return <Dialog>
        <DialogTrigger asChild className={"w-full"}>
            <Button variant={"ghost"} className={"w-7/8"}>
                <div className={"w-full flex flex-row items-center justify-center"}>
                    <CirclePlusIcon className={"w-1/4"}/>
                    <span className={"w-3/4"}>{language['title-bar.popover.add-class-button']}</span>

                </div>
            </Button>
        </DialogTrigger>
        <DialogContent className={"max-h-6/8 flex flex-col items-center"}>

            <DialogHeader>
                <DialogTitle className={"text-primary text-xl font-semibold"}>
                    请输入课程信息
                </DialogTitle>
            </DialogHeader>
            <h1 className={"text-primary "}>该功能暂未实现</h1>
            <DialogClose>
                <Button className={"w-full"}> <CirclePlusIcon/>保存</Button>
            </DialogClose>
        </DialogContent>
    </Dialog>
}