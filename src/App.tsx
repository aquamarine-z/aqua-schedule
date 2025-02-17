import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ScheduleExtractor} from "./pages/schedule_extractor/ScheduleExtractor.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "./components/app-sidebar.tsx";
import {ScheduleViewer} from "@/pages/schedule_viewer/ScheduleViewer.tsx";
import {MainPage} from "@/pages/main/MainPage.tsx";
import {AppTitleBar} from "@/components/app-title-bar.tsx";


function App() {
    
    return <SidebarProvider>
        <BrowserRouter basename={"/aqua-schedule"} >
            <AppSidebar/>
            <main className={"h-[100vh] w-full overflow-hidden"}>
                <div className={"flex flex-col w-full h-full overflow-y-scroll"}>
                    <AppTitleBar/>
                        <Routes>
                        <Route path={"/schedule_extractor"} element={<ScheduleExtractor/>}/>
                        <Route path={"/main"} element={<MainPage/>}/>
                        <Route path={""} element={<ScheduleViewer/>}/>
                    </Routes>
                    </div>
                
            </main>
        </BrowserRouter>
    </SidebarProvider>
}

export default App
