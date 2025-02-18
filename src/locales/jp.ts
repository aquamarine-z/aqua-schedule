import en from "@/locales/en.ts";

export default {
    ...en,
    "sidebar.header.app-name": "Aquaスケジュール",
    "sidebar.group.schedule-list.title": "スケジュール",
    "sidebar.group.page-navigator.title": "ナビゲーター",
    "sidebar.group.page-navigator.main-page": "メインページ",
    "sidebar.group.page-navigator.extractor": "スケジュール抽出",
    "sidebar.group.page-navigator.importer": "スケジュールインポート",
    "sidebar.group.page-navigator.settings": "設定",

    "title-bar.week-number": (weekNumber: number) => `第${weekNumber}週`,
    "title-bar.term-started": (started: boolean) => started ? "開始済み" : "未開始",

    "title-bar.popover.rename-button": "このスケジュールの名前を変更",
    "title-bar.dialog.rename.title": "スケジュール名の変更",
    "title-bar.dialog.rename.input.placeholder": "新しい名前を入力してください。",
    "title-bar.dialog.rename.cancel": "キャンセル",
    "title-bar.dialog.rename.confirm": "確認",
    "title-bar.dialog.rename.toast.name-empty": "名前を空にすることはできません",
    "title-bar.dialog.rename.toast.rename-successfully": "名前を正常に変更しました",

    "title-bar.popover.export-button": "このスケジュールをエクスポート",
    "title-bar.dialog.export.title": "エクスポート方法を選択してください",
    "title-bar.dialog.export.to-clipboard.button": "クリップボードへ",
    "title-bar.dialog.export.to-clipboard.toast.export-successfully": "クリップボードに正常にエクスポートしました",
    "title-bar.dialog.export.to-file.button": "ファイルへ",
    "title-bar.dialog.export.to-file.toast.export-successfully": "ファイルに正常にエクスポートしました。ファイルをダウンロードしてください",

    "title-bar.popover.add-class-button": "新しいクラスを追加",
    "title-bar.popover.delete-button": "このスケジュールを削除",

    "title-bar.dialog.delete.title": "削除",
    "title-bar.dialog.delete.message": "このスケジュールを削除してもよろしいですか？",
    "title-bar.dialog.delete.confirm": "削除",
    "title-bar.dialog.delete.cancel": "キャンセル",
    "title-bar.dialog.delete.toast.delete-successfully": "正常に削除しました",

    "schedule-viewer.month": (month: number) => {
        switch (month) {
            case 1:
                return "1月";
            case 2:
                return "2月";
            case 3:
                return "3月";
            case 4:
                return "4月";
            case 5:
                return "5月";
            case 6:
                return "6月";
            case 7:
                return "7月";
            case 8:
                return "8月";
            case 9:
                return "9月";
            case 10:
                return "10月";
            case 11:
                return "11月";
            case 0:
                return "12月";
        }
    },
    "schedule-viewer.weekday": (weekday: number) => {
        switch (weekday) {
            case 0:
                return "日";
            case 1:
                return "月";
            case 2:
                return "火";
            case 3:
                return "水";
            case 4:
                return "木";
            case 5:
                return "金";
            case 6:
                return "土";
        }
    },
    "settings.page-title": "設定",
    "settings.language.title": "言語",
    "settings.background.title": "背景画像",
    "settings.background.no-background": "まだ選択されていません",
    "settings.background.import": "インポート",
    "settings.background.remove": "削除",
    "settings.background.remove.dialog.title": "背景を削除",
    "settings.background.remove.dialog.message": "背景画像を削除してもよろしいですか？",
    "settings.background.remove.dialog.confirm": "確認",
    "settings.background.remove.dialog.cancel": "キャンセル",
    "settings.background.toast.import-successfully": "インポート成功",
    "settings.background.toast.import-failed": "インポート失敗",
    "settings.background.toast.remove-successfully": "削除成功",
    "settings.background.toast.remove-failed": "削除失敗"

} as unknown as typeof en;
