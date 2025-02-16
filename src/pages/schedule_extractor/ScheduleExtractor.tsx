import {Button} from "@/components/ui/button.tsx";

class ScheduleClass {
    name: string = ""
    teachers: string[] = []
    classIndexFrom: number = 0
    classIndexTo: number = 0
    weekIndex: number[] = []
    weekday: number = 0
    classLocation: string = ""
    teachingClassName: string = ""
    teachingClassComposition: string = ""
    examinationType: string = ""
    comment: string = ""
    timeComposition: string = ""
    weekTime: number = 0
    totalTime: number = 0
    point: number = 0
    classType: number = 0
}

export function ScheduleExtractor() {
    const analyze = async () => {
        let textContent = ""
        try {
            const text = await navigator.clipboard.readText();
            //console.log('剪贴板的文本内容：', text);
            textContent = text
        } catch (err) {
            alert('读取剪贴板内容时出错:' + err);
            return
        }
        //从defaultDomTree解析
        const resultArray: ScheduleClass[] = []
        const domTree = new DOMParser().parseFromString(textContent, "text/html")
        const table = domTree.querySelector("table")
        if (table === null) {
            alert("DomTree格式错误")
            return
        }
        const classElements = table.querySelectorAll("td.td_wrap")
        //console.log(classElements)
        let timeElement: string | null
        let classLocationElement: string
        let teacherElement: string | null
        let teachingClassNameElement: string | null
        let teachingClassCompositionElement: string | null
        let examinationTypeElement: string | null
        let commentElement: string | null
        let timeCompositionElement: string | null
        let weekTimeElement: string | null
        let totalTimeElement: string | null
        let pointElement: string | null
        classElements.forEach(classElement => {
            if (classElement === null || classElement.innerHTML === "") return
            const weekday = parseInt(classElement.id.split("-")[0], 10)
            let name = classElement.querySelector("span.title font")?.textContent || ""
            let classType: number
            switch (name.charAt(name.length - 1)) {
                case "◆":
                    classType = 1
                    break
                case "◇":
                    classType = 2
                    break
                default:
                    classType = 0
                    break

            }
            name = name.slice(0, name.length - 1)
            classElement.querySelectorAll("p").forEach(pElement => {
                const span = pElement.querySelector("span")
                switch (span?.title) {
                    case "节/周":
                        timeElement = pElement.textContent
                        break
                    case "上课地点":
                        classLocationElement = pElement.textContent?.trim() || ""
                        break
                    case "教师 ":
                        teacherElement = pElement.textContent
                        break
                    case "教学班名称":
                        teachingClassNameElement = pElement.textContent
                        break
                    case "教学班组成":
                        teachingClassCompositionElement = pElement.textContent
                        break
                    case "考核方式":
                        examinationTypeElement = pElement.textContent
                        break
                    case "选课备注":
                        commentElement = pElement.textContent
                        break
                    case "课程学时组成":
                        timeCompositionElement = pElement.textContent
                        break
                    case "周学时":
                        weekTimeElement = pElement.textContent
                        break
                    case "总学时":
                        totalTimeElement = pElement.textContent
                        break
                    case "学分":
                        pointElement = pElement.textContent
                        break

                }
            })

            //console.log(timeElement)
            const pattern = /\((\d+)(?:-(\d+))?节\)(\d+(?:-\d+)?周)/;
            const match = timeElement?.match(pattern);
            const classInformation = {
                name,
            } as ScheduleClass
            if (match) {
                const classIndexFrom = parseInt(match[1], 10);
                const classIndexTo = parseInt(match[2], 10);
                const weekInformationString = match[3];
                if (weekInformationString.includes("-")) {
                    classInformation.weekIndex = []
                    const [weekIndexFrom, weekIndexTo] = weekInformationString.split("-").map(weekIndex => parseInt(weekIndex, 10));
                    for (let i = weekIndexFrom; i <= weekIndexTo; i++) {
                        classInformation.weekIndex.push(i)
                    }
                } else {
                    classInformation.weekIndex = [parseInt(weekInformationString, 10)];
                }
                classInformation.classIndexFrom = classIndexFrom
                classInformation.classIndexTo = classIndexTo

            } else {
                console.error("字符串格式不匹配");
            }
            classInformation.weekday = weekday
            classInformation.classLocation = classLocationElement
            classInformation.teachers = teacherElement?.split(",").map(teacher => teacher.trim()) || []
            classInformation.teachingClassName = teachingClassNameElement || ""
            classInformation.teachingClassComposition = teachingClassCompositionElement || ""
            classInformation.examinationType = examinationTypeElement || ""
            classInformation.comment = commentElement || ""
            classInformation.timeComposition = timeCompositionElement || ""
            classInformation.weekTime = parseInt(weekTimeElement || "0", 10)
            classInformation.totalTime = parseInt(totalTimeElement || "0", 10)
            classInformation.point = parseFloat(pointElement || "0")
            classInformation.classType = classType
            resultArray.push(classInformation)
        })
        if (confirm("解析完成 点击确认将其复制到剪贴板")) {
            await navigator.clipboard.writeText(JSON.stringify(resultArray))
        }
        //console.log(JSON.stringify(resultArray))
    }
    return <div className={"w-full h-full flex items-center justify-center"}>
        <div className={"flex flex-col gap-8 w-7/8 justify-center items-center"}>
            <h1 className={"text-2xl font-bold"}>课程表提取器</h1>
            <h2 className={"text-md font-medium text-center"}>请将课程表DomTree复制到剪贴板 并按下下方按钮进行解析</h2>
            <Button className={"hover:cursor-pointer"} onClick={analyze}>解析</Button>
        </div>

    </div>
}