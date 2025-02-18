import en from "@/locales/en.ts";

export default {
    ...en,
    "sidebar.header.app-name": "Aqua Schedule",
    "sidebar.group.schedule-list.title": "课程表",
    "sidebar.group.page-navigator.title": "页面导航",
    "sidebar.group.page-navigator.main-page": "首页",
    "sidebar.group.page-navigator.extractor": "课程表提取器",
    "sidebar.group.page-navigator.importer": "课程表导入",
    "sidebar.group.page-navigator.settings": "设置",

    "title-bar.week-number": (weekNumber: number) => `第${weekNumber}周`,
    "title-bar.term-started": (started: boolean) => started ? "已开学" : "未开学",

    "title-bar.popover.rename-button": "课程表重命名",
    "title-bar.dialog.rename.title": "课程表重命名",
    "title-bar.dialog.rename.input.placeholder": "请输入新的名字",
    "title-bar.dialog.rename.cancel": "取消",
    "title-bar.dialog.rename.confirm": "确认",
    "title-bar.dialog.rename.toast.name-empty": "名字不能为空!",
    "title-bar.dialog.rename.toast.rename-successfully": "重命名成功!",


    "title-bar.popover.export-button": "课程表导出",
    "title-bar.dialog.export.title": "请选择导出方式",
    "title-bar.dialog.export.to-clipboard.button": "导出到剪贴板",
    "title-bar.dialog.export.to-clipboard.toast.export-successfully": "已经成功导出到剪贴板",
    "title-bar.dialog.export.to-file.button": "导出到文件",
    "title-bar.dialog.export.to-file.toast.export-successfully": "已成功导出到文件,请保存此文件",


    "title-bar.popover.add-class-button": "添加新课程",

    "title-bar.popover.delete-button": "删除此课程表",

    "title-bar.dialog.delete.title": "删除课程表",
    "title-bar.dialog.delete.message": "你确定要删除此课程表吗?",
    "title-bar.dialog.delete.confirm": "删除",
    "title-bar.dialog.delete.cancel": "取消",
    "title-bar.dialog.delete.toast.delete-successfully": "成功删除",

    "schedule-viewer.month": (month: number) => {
        switch (month) {
            case 1:
                return "1月"
            case 2:
                return "2月"
            case 3:
                return "3月"
            case 4:
                return "4月"
            case 5:
                return "5月"
            case 6:
                return "6月"
            case 7:
                return "7月"
            case 8:
                return "8月"
            case 9:
                return "9月"
            case 10:
                return "10月"
            case 11:
                return "11月"
            case 0:
                return "12月"
        }
    },
    "schedule-viewer.weekday": (weekday: number) => {
        switch (weekday) {
            case 0:
                return "日"
            case 1:
                return "一"
            case 2:
                return "二"
            case 3:
                return "三"
            case 4:
                return "四"
            case 5:
                return "五"
            case 6:
                return "六"
        }
    },
    "settings.page-title": "设置",
    "settings.language.title": "语言",
    "settings.background.title": "背景图片",
    "settings.background.no-background": "尚未选择",
    "settings.background.import": "导入",
    "settings.background.remove": "移除",
    "settings.background.remove.dialog.title": "移除背景",
    "settings.background.remove.dialog.message": "确定要移除背景图片吗？",
    "settings.background.remove.dialog.confirm": "确认",
    "settings.background.remove.dialog.cancel": "取消",
    "settings.background.toast.import-successfully": "导入成功",
    "settings.background.toast.import-failed": "导入失败",
    "settings.background.toast.remove-successfully": "移除成功",
    "settings.background.toast.remove-failed": "移除失败",
    "settings.background.change.mode.label": "背景更改模式",
    "settings.background.change.mode.auto-time": "定时自动更换",
    "settings.background.change.mode.auto-open": "打开时自动更换",
    "settings.background.change.mode.by-user": "用户手动更换",
    "settings.background.select.mode.label": "背景选择模式",
    "settings.background.select.mode.random": "随机",
    "settings.background.select.mode.loop": "循环",
    "settings.background.change-time": "背景更换时间（分钟）",
    "settings.background.button.change": "更换背景",
    "settings.background.button.change.toast.message": "背景已更换",
    "settings.background.button.select": "选择背景",
    "settings.background.button.select.toast.message": "背景已选择",
    "settings.background.by-user.button.select": "选择此背景"
} as unknown as typeof en;