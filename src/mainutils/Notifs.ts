import { Notification } from "electron"
import { APPPATHS } from "./Paths"
import Config from "./Config"
import { ICON } from "../main"

class Notifs {
    notifTemplates: Record<"minimise" | "uploading", Notification> = {
        minimise: null,
        uploading: null
    }

    init() {
        this.notifTemplates = {
            minimise: new Notification({
                title: `${APPPATHS.APP_NAME} is still running!`,
                body: "Close it by right-clicking it in the tray and clicking \"Quit\"",
                icon: ICON
            }),
            uploading: new Notification({
                title: `Uploading...`,
                body: "Now syncing folder",
                icon: ICON
            })
        }
    }

    showNotification(template: keyof typeof this.notifTemplates) {
        if (Config.notifAllowed(template)) this.notifTemplates[template].show()
    }
}

export default new Notifs()