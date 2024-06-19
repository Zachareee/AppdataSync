import { promises as fs } from "fs"
import { drive, drive_v3 } from "@googleapis/drive";
import { authenticate } from "@google-cloud/local-auth";
import { OAuth2Client, auth } from "google-auth-library"
import path from "path"

import { PATHTYPE, drives } from "../common";
import { CloudProvider, FILENAMEPROGRESSPAIR } from "./CloudProvider";
import { APPDATA_PATHS, APPPATHS } from "../mainutils/Paths";
import Archive from "../mainutils/Archive";

const GDRIVE_CREDENTIALS = path.join(APPPATHS.CREDENTIALS_PATH, 'GAPI.json');
const TOKEN_PATH = `${APPPATHS.TOKEN_FOLDER}/${drives["googleDrive"].tokenFile}`
const FILE_EXTENSION = /.gzip$/

export class GDrive extends CloudProvider {
    private static gDrive: drive_v3.Drive
    private static authClient: OAuth2Client
    private static folderMapping: Record<PATHTYPE, string>

    static override async init() {
        GDrive.authClient = await authorize()
        GDrive.gDrive = drive({ version: 'v3', auth: GDrive.authClient })
        GDrive.folderMapping = await this.checkHomeFolder().catch(this.createHomeFolder)

        return GDrive
    }

    static override async abortAuth() {
        fetch("http://localhost:3000").then(data => data.text()).then(() => console.warn("Aborted"))
    }

    static override async logout() {
        GDrive.authClient.revokeCredentials()
        fs.rm(TOKEN_PATH)
    }

    // Tests if folder exists, update if it does
    // create if it doesn't
    static override async uploadFolder(context: PATHTYPE, name: string, upload: boolean) {
        GDrive.gDrive.files.list({
            q: `name = '${name}.gzip' and '${GDrive.folderMapping[context]}' in parents and trashed = false`,
            pageSize: 1,
            fields: "files(id)"
        }).then(res => res.data.files).then(arr => {
            if (upload)
                if (arr.length) this.updateFile(context, name, arr[0].id)
                else this.createFile(context, name)
            else this.deleteFile(arr[0].id)
        })
    }

    static override async downloadFolders(): FILENAMEPROGRESSPAIR {
        return <FILENAMEPROGRESSPAIR>GDrive.getFolders().then(folders =>
            Object.fromEntries(
                Object.entries(folders).map(([context, filearr]) =>
                    [context, Object.fromEntries(filearr.map(
                        file => [file.name.replace(FILE_EXTENSION, ""), this.downloadFolder(<PATHTYPE>context, file)]
                    ))])))
    }

    private static async downloadFolder(context: PATHTYPE, { id: fileId, modifiedTime, name }: drive_v3.Schema$File) {
        const nameWithoutFileExt = name.replace(FILE_EXTENSION, "")
        const onlineModTime = new Date(modifiedTime)
        const offlineModTime = await Archive.getLastModDate(path.join(APPDATA_PATHS[context], nameWithoutFileExt)).catch(() => new Date(1970, 0))

        if (onlineModTime < offlineModTime) return this.uploadFolder(context, nameWithoutFileExt, true)
        else if (onlineModTime > offlineModTime) {
            console.log("Now downloading ", name)
            return GDrive.gDrive.files.get({ fileId, alt: "media" }, { responseType: "stream" }).then(
                ({ data }) => Archive.extractArchive(context, data)
            )
        }
    }

    private static async getFolders() {
        const folders = <Record<PATHTYPE, drive_v3.Schema$File[]>>Object.fromEntries(PATHTYPE.map(key => [key, []]))
        await Promise.all(PATHTYPE.map(async path => {
            let files, nextPageToken
            do {
                ({ files, nextPageToken } = await GDrive.gDrive.files.list({
                    q: `'${GDrive.folderMapping[<PATHTYPE>path]}' in parents and trashed = false`,
                    fields: "nextPageToken, files(id, name, modifiedTime)",
                    pageToken: nextPageToken
                }).then(res => res.data))
                folders[<PATHTYPE>path].push(...files)
            } while (nextPageToken)
        }))

        return folders
    }

    private static async checkHomeFolder(): Promise<Record<PATHTYPE, string>> {
        return GDrive.gDrive.files.list({
            q: `name = '${APPPATHS.APP_NAME}' and mimeType = '${FILETYPE.FOLDER}' and trashed = false`,
            pageSize: 1,
            fields: "files(id)"
        }).then(async ({ data: { files: [{ id }] } }) =>
            Object.fromEntries(await Promise.all(PATHTYPE.map(path =>
                GDrive.gDrive.files.list({
                    q: `name = '${path}' and mimeType = '${FILETYPE.FOLDER}' and trashed = false and '${id}' in parents`,
                    pageSize: 1,
                    fields: "files(name, id)"
                }).then(({ data: { files: [{ name, id }] } }) => [name, id])
            )))
        )
    }

    private static async createHomeFolder(): Promise<Record<PATHTYPE, string>> {
        return GDrive.gDrive.files.create({
            requestBody: {
                name: APPPATHS.APP_NAME,
                description: "Your synced appdata is stored here! Source: AppdataSync https://github.com/Zachareee/AppdataSync",
                mimeType: FILETYPE.FOLDER
            }, fields: "id"
        }).then(async ({ data: { id: parentID } }) => Object.fromEntries(await Promise.all(
            PATHTYPE.map(name => GDrive.gDrive.files.create({
                requestBody: {
                    name,
                    parents: [parentID],
                    mimeType: FILETYPE.FOLDER
                }, fields: "id, name"
            }).then(({ data: { name, id } }) => [name, id]))))
        )
    }

    private static async updateFile(context: PATHTYPE, pathName: string, id: string) {
        return this.createUploadBody(context, pathName, id).then(body => GDrive.gDrive.files.update(body))
    }

    private static async deleteFile(fileId: string) {
        return GDrive.gDrive.files.delete({ fileId })
    }

    private static async createFile(context: PATHTYPE, pathName: string) {
        return this.createUploadBody(context, pathName).then(body => GDrive.gDrive.files.create(body))
    }

    private static async createUploadBody(context: PATHTYPE, pathName: string, fileId: string): Promise<drive_v3.Params$Resource$Files$Update>
    private static async createUploadBody(context: PATHTYPE, pathName: string, fileId?: string): Promise<drive_v3.Params$Resource$Files$Create>
    private static async createUploadBody(context: PATHTYPE, pathName: string, fileId?: string) {
        console.log("Uploading", pathName)
        return Archive.getLastModDate(path.join(APPDATA_PATHS[context], pathName))
            .then(date => date.toISOString())
            .then(modifiedTime => ({
                requestBody: {
                    name: `${pathName}.gzip`,
                    parents: fileId ? undefined : [GDrive.folderMapping[context]],
                    modifiedTime
                },
                media: {
                    body: Archive.createArchive(context, pathName),
                },
                uploadType: "multipart",
                fileId
            }))
    }
}

enum FILETYPE {
    FOLDER = "application/vnd.google-apps.folder"
}

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    const content = await fs.readFile(TOKEN_PATH, "ascii");
    const credentials = JSON.parse(content);
    return <OAuth2Client>auth.fromJSON(credentials);
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client) {
    if (!client.credentials) return client
    const content = await fs.readFile(GDRIVE_CREDENTIALS, "ascii");
    const keys = JSON.parse(content);
    const { client_id, client_secret } = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id,
        client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload)
    return client
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    try {
        return await loadSavedCredentialsIfExist();
    } catch {
        return authenticate({
            scopes: SCOPES,
            keyfilePath: GDRIVE_CREDENTIALS,
        }).then(saveCredentials)
    }
}