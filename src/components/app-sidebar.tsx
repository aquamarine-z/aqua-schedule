import {
    Sidebar,
    SidebarContent,
    SidebarFooter, SidebarGroup, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocation,useNavigate} from "react-router-dom";
import {useAtom} from "jotai";
import {ScheduleInformation} from "@/store/schedule.ts";

export function AppSidebar() {
    const location=useLocation()
    const navigate=useNavigate()
    const [schedule,setSchedule]=useAtom(ScheduleInformation)
    return (
        <Sidebar >
            <SidebarHeader className={"flex items-center border-b-sidebar-border border-b-[1px]"}>
                <h1 className={"font-bold text-xl text-center"}>Aqua Schedule</h1>
            </SidebarHeader>
            <SidebarContent className={""}>
                <SidebarGroup>
                    <SidebarGroupLabel>课程表列表</SidebarGroupLabel>
                    <SidebarMenu>
                         {schedule.schedules.map((item,index)=>{
                        return <SidebarMenuItem key={index}>
                            <SidebarMenuButton onClick={()=>{
                                if(schedule.selectedIndex!==index){
                                    setSchedule({...schedule,selectedIndex:index})
                                }
                                navigate("/")
                            }} className={"flex items-center justify-center"} asChild  isActive={location.pathname==="/"&&schedule.selectedIndex===index}>
                                <span className={"text-center"}>{item.name}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    })}
                    </SidebarMenu>
                   
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>页面导航</SidebarGroupLabel>
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton isActive={location.pathname==="/main"} className={"flex items-center justify-center"} asChild onClick={()=>{navigate("/main")}}>
                           <span className={"text-center text-2xl"}>首页</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton isActive={location.pathname==="/schedule_extractor"} className={"flex items-center justify-center"} asChild onClick={()=>{navigate("/schedule_extractor")}}>
                           <span className={"text-center"}>课程表提取器</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                        <SidebarMenuItem>
                        <SidebarMenuButton isActive={location.pathname==="/schedule_importer"} className={"flex items-center justify-center"} asChild onClick={()=>{navigate("/schedule_importer")}}>
                           <span className={"text-center"}>课程表导入</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                </SidebarGroup>
                
            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    )
}
