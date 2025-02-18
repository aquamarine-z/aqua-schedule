import {
    Sidebar,
    SidebarContent,
    SidebarFooter, SidebarGroup, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useLocation, useNavigate} from "react-router-dom";
import {useAtom} from "jotai";
import {ScheduleInformation} from "@/store/schedule.ts";
import {Button} from "@/components/ui/button.tsx";
import {Moon, Sun} from "lucide-react";
import {useTheme} from "@/components/ui/theme-provider.tsx";
import {LanguagePack} from "@/store/language.ts";

export function AppSidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const [schedule, setSchedule] = useAtom(ScheduleInformation)
    const theme=useTheme()
    const language=useAtom(LanguagePack)[0].language
    return (
        <Sidebar>
            <SidebarHeader className={"flex items-center border-b-sidebar-border border-b-[1px]"}>
                <h1 className={"font-bold text-xl text-center"}>{language["sidebar.header.app-name"]}</h1>
            </SidebarHeader>
            <SidebarContent className={""}>
                <SidebarGroup>
                    <SidebarGroupLabel>{language["sidebar.group.schedule-list.title"]}</SidebarGroupLabel>
                    <SidebarMenu>
                        {schedule.schedules.map((item, index) => {
                            return <SidebarMenuItem key={index}>
                                <SidebarMenuButton onClick={() => {
                                    if (schedule.selectedIndex !== index) {
                                        setSchedule({...schedule, selectedIndex: index})
                                    }
                                    navigate("/")
                                }} className={"flex items-center justify-center transition"} asChild
                                                   isActive={location.pathname === "/" && schedule.selectedIndex === index}>
                                    <span className={"text-center"}>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        })}
                    </SidebarMenu>

                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{language["sidebar.group.page-navigator.title"]}</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={location.pathname === "/main"}
                                               className={"flex items-center justify-center"} asChild onClick={() => {
                                navigate("/main")
                            }}>
                                <span className={"text-center text-2xl"}>{language["sidebar.group.page-navigator.main-page"]}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={location.pathname === "/schedule_extractor"}
                                               className={"flex items-center justify-center"} asChild onClick={() => {
                                navigate("/schedule_extractor")
                            }}>
                                <span className={"text-center"}>{language["sidebar.group.page-navigator.extractor"]}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={location.pathname === "/schedule_importer"}
                                               className={"flex items-center justify-center"} asChild onClick={() => {
                                navigate("/schedule_importer")
                            }}>
                                <span className={"text-center"}>{language["sidebar.group.page-navigator.importer"]}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={location.pathname === "/settings"}
                                               className={"flex items-center justify-center"} asChild onClick={() => {
                                navigate("/settings")
                            }}>
                                <span className={"text-center"}>{language["sidebar.group.page-navigator.settings"]}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                <Button variant="outline" size="icon" onClick={()=>{
                    if(theme.theme==="dark") theme.setTheme("light")
                    if(theme.theme==="light") theme.setTheme("dark")
                }}>
                    <Sun
                        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                    <Moon
                        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
