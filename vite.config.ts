import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as path from "node:path";
import {VitePWA} from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy'
// https://vite.dev/config/
export const getCache = ({name, pattern}: never) => ({
    urlPattern: pattern,
    handler: 'CacheFirst' as const,
    options: {
        cacheName: name,
        expiration: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 365 * 2 // 2 years
        },
        cacheableResponse: {
            statuses: [200]
        }
    }
})

export default defineConfig({
    base: '/aqua-schedule/',
    plugins: [react(), tailwindcss(), legacy({
        targets: ['iOS 7.1'],
        modernPolyfills: true,
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
        VitePWA({
            registerType: "prompt",
            workbox: {
                clientsClaim: false, // 不立即接管控制权
                skipWaiting: false, // 让新的 Service Worker 立即生效
                globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'], //缓存相关静态资源

                runtimeCaching: [
                    // 配置自定义运行时缓存
                ]
            },
            manifest: {
                "name": 'Aqua Schedule',
                "description": "西南大学的课程表查看工具PWA",
                "theme_color": "#b6e3ff",
                shortcuts: [ // 配置快捷方式，指定打开页面地址
                    {
                        name: "Aqua Schedule", // 快捷方式名称
                        short_name: "AS", // 快捷方式简称
                        description: "Aqua Schedule", // 快捷方式描述
                        url: "/", // 快捷方式链接地址
                        icons: [{src: "/vite.svg", sizes: "36x36"}], // 快捷方式图标配置
                    },
                ],
                // 为了方便，使用svg图标
                icons: [
                    {
                        "src": "/vite.svg",
                        "sizes": "192x192",
                        "type": "image/svg+xml"
                    },
                    {
                        "src": "/vite.svg",
                        "sizes": "512x512",
                        "type": "image/svg+xml"
                    }
                ]
            },


            devOptions: {
                // 如果想在`vite dev`命令下调试PWA, 必须启用它
                enabled: true,
                // Vite在dev模式下会使用浏览器原生的ESModule，将type设置为`"module"`与原先的保持一致
                type: "module"
            }
        })],
    build: {
        target: ['iOS 7.1'],
        minify: 'terser',
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server:{
        host:"0.0.0.0"
    }
})
