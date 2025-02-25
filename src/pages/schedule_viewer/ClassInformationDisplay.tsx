import {Dialog, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import {ExtendedDialogContent} from "@/components/ui/dialog-extensions.tsx";
import {ScheduleClass, SchoolName} from "@/constants/schedule-types.ts";
import {getExtractorByName} from "@/pages/schedule_viewer/InformationExtractor.tsx";

export function ClassInformationDisplay(props: {
    classInformation?: ScheduleClass,
    dayIndex?: number,
    classIndex: number,
    schoolName?: SchoolName
}) {
    const [openDialog, setOpenDialog] = useState(false)


    if (!props.classInformation) {
        return <td key={props.dayIndex}/>
    } else if (props.classInformation.classIndexFrom === props.classIndex) {
        const [blockExtractor, dialogExtractor] = getExtractorByName(props.schoolName)
        const blockInformation = blockExtractor(props.classInformation)
        const dialogInformation = dialogExtractor(props.classInformation)
        return <td key={props.dayIndex}
                   onClick={() => {
                       setOpenDialog(true)
                   }}
                   className={"h-full overflow-hidden shadow-2xl glass w-full rounded-lg "}
                   rowSpan={props.classInformation.classIndexTo - props.classInformation.classIndexFrom + 1}>
            <Dialog open={openDialog} onOpenChange={open => setOpenDialog(open)} modal={true}>

                <div
                    className={"w-full max-h-full flex items-center flex-col justify-start p-1 gap-2"}>
                    {blockInformation.map((it, index) => {
                        return <p
                            className={"text-[12px] text-primary/60 text-center line-clamp-3 font-semibold"}
                            key={index}>{it}</p>
                    })}
                </div>
                <ExtendedDialogContent
                    closeButton={false}
                    stopEvents={true}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    className={"select-none w-6/8 h-4/8 shadow-2xl outline-0 glass bg-white rounded-2xl flex flex-col border-0 items-center backdrop-blur-xl gap-2 text-black p-2  "}>
                    <DialogHeader>
                        <DialogTitle
                            className={"mt-2 font-semibold text-2xl mb-2 w-full text-center text-primary opacity-60"}>
                            {props.classInformation.name}

                        </DialogTitle>
                    </DialogHeader>
                    <div className={"w-full overflow-y-auto noScrollBar"}>
                        <table className={"w-full table-fixed border-spacing-[8px] border-separate"}>
                            <tbody>
                                {Array.from(dialogInformation.entries()).map(([key, value]) => {
                                    return <tr key={key}>
                                        <td className={"text-lg text-primary font-semibold opacity-50 text-center"}>
                                            <span>{key}</span>
                                        </td>
                                        <td className={"text-lg text-primary font-semibold opacity-50 text-center"}>
                                            <span>{value}</span>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>

                </ExtendedDialogContent>
            </Dialog>
        </td>
    } else return <></>
}