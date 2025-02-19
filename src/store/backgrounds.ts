// 初始化 IndexedDB 数据库
import {openDB} from "idb";
import {atomWithStorage, createJSONStorage} from "jotai/utils";
import {useMemo} from "react";
import {atom, useAtom} from "jotai";
import {SettingsAtom} from "@/store/settings.ts";

const dbPromise = openDB("settings", 1, {
    upgrade(db) {
        db.createObjectStore("store");
    },
});

// IndexedDB 存储适配器
const indexedDBStorage = {
    getItem: async (key: string) => {
        const db = await dbPromise;
        return await db.get("store", key);
    },
    setItem: async (key: string, value: never) => {
        const db = await dbPromise;
        await db.put("store", value, key);
    },
    removeItem: async (key: string) => {
        const db = await dbPromise;
        await db.delete("store", key);
    },
};

export const BackgroundsAtom = atomWithStorage("backgrounds", [] as string[],// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createJSONStorage(() => indexedDBStorage)
)
export const backgroundsLoadedAtom = atom(false)
export const useBackgroundSettings = () => {
    const [backgrounds, setBackgrounds] = useAtom(BackgroundsAtom);
    const [settings, setSettings] = useAtom(SettingsAtom)
    const [backgroundsLoaded, setBackgroundsLoaded] = useAtom(backgroundsLoadedAtom)
    return useMemo(() => ({
        appendBackground: async (background: string) => {
            await setBackgrounds(async prev => {
                const value = await prev
                return [...value, background]
            });
        },
        removeBackground: async (index: number) => {
            await setBackgrounds(async prev => {
                const value = await prev
                value.splice(index, 1)
                return value
            });
        },
        nowBackground:()=>{
            return backgrounds[settings.backgroundSettings.backgroundCurrentIndex]
        },
        loadBackgrounds: async () => {
            await setBackgrounds(async prev => {
                return prev;
            })
            setBackgroundsLoaded(true)
        },
        nextBackground: () => {
            let nextIndex = settings.backgroundSettings.backgroundCurrentIndex
            if (settings.backgroundSettings.backgroundSelectMethod === "random") {
                nextIndex = Math.floor(Math.random() * backgrounds.length)
            } else if (settings.backgroundSettings.backgroundSelectMethod === "loop") {
                nextIndex = (nextIndex + 1) % backgrounds.length
            }
            setSettings((prev) => ({
                ...prev,
                backgroundSettings: {
                    ...prev.backgroundSettings,
                    backgroundCurrentIndex: nextIndex
                }
            }))
        },
        checkChangeBackgroundTime:()=>{
            return Date.now() - settings.backgroundSettings.backgroundLastChangeTime > settings.backgroundSettings.backgroundAutoChangeTime * 1000 * 60
        },
        setLastSetBackgroundTime: () => {
            setSettings((prev) => ({
                ...prev,
                backgroundSettings: {
                    ...prev.backgroundSettings,
                    lastSetBackgroundTime: Date.now()
                }
            }))
        },
        backgroundsLoaded: backgroundsLoaded

    }), [setBackgrounds, setSettings, backgrounds, settings, backgroundsLoaded, setBackgroundsLoaded]);
};