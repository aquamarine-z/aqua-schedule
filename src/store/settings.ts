

import {atomWithStorage, createJSONStorage} from "jotai/utils";
import {openDB} from "idb";

// 初始化 IndexedDB 数据库
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


export const SettingsStorage = atomWithStorage("settings", {
        backgroundSettings: {
            backgrounds: [] as string[],
            backgroundChangeMode: "auto-open" as "auto-time"|"auto-open" | "by-user",
            backgroundAutoChangeTime: 60,
            backgroundLastChangeTime: new Date().getTime(),
            backgroundCurrentIndex: 0,
            backgroundSelectMethod: "random" as "random" | "loop",
        },
        language: "en"


    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    createJSONStorage(() => indexedDBStorage))