export default {
    "sidebar.header.app-name": "Aqua Schedule",
    "sidebar.group.schedule-list.title": "Schedules",
    "sidebar.group.page-navigator.title": "Navigator",
    "sidebar.group.page-navigator.main-page": "Main Page",
    "sidebar.group.page-navigator.extractor": "Schedule Extractor",
    "sidebar.group.page-navigator.importer": "Schedule Importer",
    "sidebar.group.page-navigator.settings": "Settings",

    "title-bar.week-number": (weekNumber: number) => `Week ${weekNumber}`,
    "title-bar.term-started": (started: boolean) => started ? "Started" : "Not Start",

    "title-bar.popover.rename-button": "Rename this schedule",
    "title-bar.dialog.rename.title": "Rename Schedule",
    "title-bar.dialog.rename.input.placeholder": "Please input the new name.",
    "title-bar.dialog.rename.cancel": "Cancel",
    "title-bar.dialog.rename.confirm": "Confirm",
    "title-bar.dialog.rename.toast.name-empty": "Name can't be empty",
    "title-bar.dialog.rename.toast.rename-successfully": "Rename successfully",


    "title-bar.popover.export-button": "Export this schedule",
    "title-bar.dialog.export.title": "Please choose the way to export",
    "title-bar.dialog.export.to-clipboard.button": "To Clipboard",
    "title-bar.dialog.export.to-clipboard.toast.export-successfully": "Export successfully to Clipboard",
    "title-bar.dialog.export.to-file.button": "To File",
    "title-bar.dialog.export.to-file.toast.export-successfully": "Export successfully to file, please download the file",


    "title-bar.popover.add-class-button": "Add a new class",
    "title-bar.popover.delete-button": "Delete this schedule",

    "title-bar.dialog.delete.title": "Delete",
    "title-bar.dialog.delete.message": "Are you sure to delete this schedule?",
    "title-bar.dialog.delete.confirm": "Delete",
    "title-bar.dialog.delete.cancel": "Cancel",
    "title-bar.dialog.delete.toast.delete-successfully": "Delete successfully",

    "schedule-viewer.month": (month: number) => {
        switch (month) {
            case 1:
                return "Jan"
            case 2:
                return "Feb"
            case 3:
                return "Mar"
            case 4:
                return "Apr"
            case 5:
                return "May"
            case 6:
                return "Jun"
            case 7:
                return "Jul"
            case 8:
                return "Aug"
            case 9:
                return "Sep"
            case 10:
                return "Oct"
            case 11:
                return "Nov"
            case 0:
                return "Dec"
        }
    },
    "schedule-viewer.weekday": (weekday: number) => {
        switch (weekday) {
            case 0:
                return "Sun"
            case 1:
                return "Mon"
            case 2:
                return "Tue"
            case 3:
                return "Wed"
            case 4:
                return "Thu"
            case 5:
                return "Fri"
            case 6:
                return "Sat"
        }
    },
    "settings.page-title": "Settings",
    "settings.language.title": "Language",
    "settings.background.title": "Background Image",
    "settings.background.no-background": "Not selected yet",
    "settings.background.import": "Import",
    "settings.background.remove": "Remove",
    "settings.background.remove.dialog.title": "Remove Background",
    "settings.background.remove.dialog.message": "Are you sure to remove the background image?",
    "settings.background.remove.dialog.confirm": "Confirm",
    "settings.background.remove.dialog.cancel": "Cancel",
    "settings.background.toast.import-successfully": "Import successfully",
    "settings.background.toast.import-failed": "Import failed",
    "settings.background.toast.remove-successfully": "Remove successfully",
    "settings.background.toast.remove-failed": "Remove failed",
    "settings.background.change.mode.label": "Background Change Mode",
    "settings.background.change.mode.auto-time": "Auto change with time",
    "settings.background.change.mode.auto-open": "Auto change when open",
    "settings.background.change.mode.auto-switch-view": "Auto change when switch to schedule view",
    "settings.background.change.mode.by-user": "By user",
    "settings.background.select.mode.label": "Background Select Mode",
    "settings.background.select.mode.random": "Random",
    "settings.background.select.mode.loop": "Loop",
    "settings.background.change-time": "Background Change Time (Minute)",
    "settings.background.button.change": "Change Background",
    "settings.background.button.change.toast.message": "Background Changed",
    "settings.background.button.select": "Select Background",
    "settings.background.button.select.toast.message": "Background Selected",
    "settings.background.by-user.button.select": "Select This Background",

    "update-checker.message": "New version is available.",
    "update-checker.button": "Update",
    "update-checker.dialog.title": "Version Update",
    "update-checker.dialog.message": "Are you sure to update to the new version and restart this application?",
    "update-checker.dialog.confirm": "Confirm",
    "update-checker.dialog.cancel": "Cancel",
    
    "offline-downloader.offline-mode.toast.message":"This PWA Application is now downloaded and can run without network",
}