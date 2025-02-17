import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ScheduleExtractor} from "./pages/schedule_extractor/ScheduleExtractor.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "./components/app-sidebar.tsx";
import {ScheduleViewer} from "@/pages/schedule_viewer/ScheduleViewer.tsx";
import {MainPage} from "@/pages/main/MainPage.tsx";
import {AppTitleBar} from "@/components/app-title-bar.tsx";
import {ScheduleImporter} from "@/pages/schedule_importer/ScheduleImporter.tsx";


function App() {

    return <SidebarProvider>
        <BrowserRouter basename={"/aqua-schedule"}>
            <AppSidebar/>
            <main className={"h-[100vh] w-full overflow-hidden"}>
                <div className={"flex flex-col w-full h-full overflow-y-hidden gap-0"}>
                    <AppTitleBar/>
                    <div
                        className={"pt-0 grow w-full relative h-[calc(100vh-theme(spacing.12))]"}>
                        <Routes>
                            <Route path={"/schedule_extractor"} element={<ScheduleExtractor/>}/>
                            <Route path={"/main"} element={<MainPage/>}/>
                            <Route path={""} element={<ScheduleViewer/>}/>
                            <Route path={"/schedule_importer"} element={<ScheduleImporter/>}/>
                        </Routes>
                    </div>

                </div>

            </main>
        </BrowserRouter>
    </SidebarProvider>
}

export default App
