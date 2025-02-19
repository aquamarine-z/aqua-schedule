import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ScheduleExtractor} from "./pages/schedule_extractor/ScheduleExtractor.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "./components/app-sidebar.tsx";
import {ScheduleViewer} from "@/pages/schedule_viewer/ScheduleViewer.tsx";
import {MainPage} from "@/pages/main/MainPage.tsx";
import {AppTitleBar} from "@/components/app-title-bar.tsx";
import {ScheduleImporter} from "@/pages/schedule_importer/ScheduleImporter.tsx";
import {Toaster} from "sonner";
import {ThemeProvider} from "@/components/ui/theme-provider.tsx";
import {Settings} from "@/pages/settings/Settings.tsx";
import {SettingsAtom} from "@/store/settings.ts";
import {useAtom} from "jotai";
import {useEffect} from "react";
import jp from "@/locales/jp.ts";
import zhCn from "@/locales/zh-cn.ts";
import en from "@/locales/en.ts";
import {LanguageAtom} from "@/store/language.ts";
import {UpdateChecker} from "@/components/update-checker.tsx";
import {OfflineDownloader} from "@/components/offline-downloader.tsx";


function App() {
    const setLanguage = useAtom(LanguageAtom)[1]
    const [settings, setSettings] = useAtom(SettingsAtom)
    useEffect(() => {
        let newLanguage;
        switch (settings.language) {
            case "jp":
                newLanguage = {language: jp, languageName: "jp"};
                break;
            case "zh-cn":
                newLanguage = {language: zhCn, languageName: "zh-cn"};
                break;
            default:
                newLanguage = {language: en, languageName: "en"};
        }
        setLanguage(newLanguage);
        // 只有当 `settings.language` 和 `newLanguage.languageName` 不同时才更新 `settings`
        if (settings.language !== newLanguage.languageName) {
            setSettings( prev => {
                return {...(prev as typeof settings), language: newLanguage.languageName as "jp" | "zh-cn" | "en"}
            });
        }
    }, [settings.language]);

    return <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SidebarProvider>
            <BrowserRouter basename={"/aqua-schedule"}>
                <AppSidebar/>
                <main className={"h-[100vh] w-full overflow-hidden"}>
                    <div className={"flex flex-col w-full h-full overflow-y-hidden gap-0"}>
                        <AppTitleBar/>
                        <Toaster/>
                        <UpdateChecker/>
                        <OfflineDownloader/>
                        <div
                            className={"pt-0 grow w-full relative h-[calc(100vh-theme(spacing.12))]"}>
                            <Routes>
                                <Route path={"/schedule_extractor"} element={<ScheduleExtractor/>}/>
                                <Route path={"/main"} element={<MainPage/>}/>
                                <Route path={"*"} element={<ScheduleViewer/>}/>
                                <Route path={"/schedule_importer"} element={<ScheduleImporter/>}/>
                                <Route path={"/settings"} element={<Settings/>}/>
                            </Routes>
                        </div>
                    </div>
                </main>
            </BrowserRouter>
        </SidebarProvider>
    </ThemeProvider>

}

export default App
