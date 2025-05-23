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
export const BackgroundStateAtom = atom({
    loaded: false,
    ready: false,
})
export const useBackgroundSettings = () => {
    const [backgrounds, setBackgrounds] = useAtom(BackgroundsAtom);
    const [settings, setSettings] = useAtom(SettingsAtom)
    const [backgroundState, setBackgroundState] = useAtom(BackgroundStateAtom)
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
        nowBackground: () => {
            return backgrounds[settings.background.backgroundCurrentIndex]
        },
        loadBackgrounds: async () => {
            await setBackgrounds(async prev => {
                //console.log(await prev)
                return prev;
            })
            setBackgroundState(prev => ({...prev, loaded: true}))
        },
        nextBackground: () => {
            let nextIndex = settings.background.backgroundCurrentIndex
            if (settings.background.backgroundSelectMethod === "random") {
                nextIndex = Math.floor(Math.random() * backgrounds.length)
            } else if (settings.background.backgroundSelectMethod === "loop") {
                nextIndex = (nextIndex + 1) % backgrounds.length
            }
            setSettings((prev) => ({
                ...prev,
                background: {
                    ...prev.background,
                    backgroundCurrentIndex: nextIndex
                }
            }))
        },
        checkChangeBackgroundTime: () => {
            return Date.now() - settings.background.backgroundLastChangeTime > settings.background.backgroundAutoChangeTime * 1000 * 60
        },
        setLastSetBackgroundTime: () => {
            setSettings((prev) => ({
                ...prev,
                background: {
                    ...prev.background,
                    lastSetBackgroundTime: Date.now()
                }
            }))
        },
        backgroundsLoaded: backgroundState.loaded,
        setBackgroundsLoaded: (l: boolean) => setBackgroundState(prev => {
            return {...prev, loaded: l}
        }),
        backgroundReady: backgroundState.ready,
        setBackgroundReady: (r: boolean) => setBackgroundState(prev => {
            return {...prev, ready: r}
        }),

    }), [backgroundState, setBackgrounds, backgrounds, settings.background.backgroundCurrentIndex, settings.background.backgroundSelectMethod, settings.background.backgroundLastChangeTime, settings.background.backgroundAutoChangeTime, setSettings]);
};