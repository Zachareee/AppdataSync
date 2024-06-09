import { promises as fs, createWriteStream } from "fs"
import { drive, drive_v3 } from "@googleapis/drive";
import { authenticate } from "@google-cloud/local-auth";
import { OAuth2Client, auth } from "google-auth-library"
import path from "path"
import { c } from "tar"
import { Readable } from "stream"

import { CloudProvider, drives } from "../common";
import { APPDATA_PATH, APP_NAME, TOKEN_FOLDER } from "../utils/paths";

const TOKEN_PATH = `${TOKEN_FOLDER}/${drives["googleDrive"].tokenFile}`

export class GDrive extends CloudProvider {
    private static gDrive: drive_v3.Drive
    private static authClient: OAuth2Client
    private static homeFolder: string

    static override async init() {
        GDrive.authClient = await authorize()
        GDrive.gDrive = drive({ version: 'v3', auth: GDrive.authClient })
        const fileArr = await this.checkHomeFolder()
        GDrive.homeFolder = (fileArr.length
            ? fileArr[0]
            : await this.createHomeFolder()
        ).id

        return GDrive
    }

    /**
     * Lists the names and IDs of up to 10 files.
     * @param {OAuth2Client} authClient An authorized OAuth2 client.
     */
    static override async listFiles() {
        const res = await GDrive.gDrive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        });
        const files = res.data.files;
        if (files.length === 0) {
            console.log('No files found.');
            return;
        }

        console.log('Files:');
        files.map((file) => {
            console.log(`${file.name} (${file.id})`);
        });
        return "Hi"
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
    static override async uploadFolder(name: string, upload: boolean) {
        GDrive.gDrive.files.list({
            q: `name = '${name}.gzip' and '${GDrive.homeFolder}' in parents and trashed = false`,
            pageSize: 1,
            fields: "files(id)"
        }).then(res => res.data.files).then(arr => {
            if (upload)
                if (arr.length) GDrive.updateFile(name, arr[0].id)
                else GDrive.createFile(name)
            else GDrive.deleteFile(arr[0].id)
        })
    }

    static async downloadFolders(): Promise<string[]> {
        const folders = await GDrive.getFolders()
        console.log(folders)
        folders.forEach(({ name, id }) => GDrive.downloadFolder(name, id))
        return folders.map(({ name }) => name)
    }

    private static async downloadFolder(filename: string, fileId: string) {
        const stream = createWriteStream(path.join(APPDATA_PATH, filename))
        GDrive.gDrive.files.get({ fileId, alt: "media" }, { responseType: "stream" }, (_, { data }) => {
            data.pipe(stream)
        })
    }

    private static async getFolders() {
        const folders = <drive_v3.Schema$File[]>[]
        let { files, nextPageToken } = await GDrive.gDrive.files.list({
            q: `'${GDrive.homeFolder}' in parents and trashed = false`,
            fields: "nextPageToken, files(id, name)"
        }).then(res => res.data)
        folders.push(...files)
        while (nextPageToken) {
            ({ files, nextPageToken } = await GDrive.gDrive.files.list({
                q: `${GDrive.homeFolder} in parents and trashed = false`,
                fields: "nextPageToken, files(id, name)",
                pageToken: nextPageToken
            }).then(res => res.data))
            folders.push(...files)
        }
        return folders
    }

    private static async checkHomeFolder() {
        return GDrive.gDrive.files.list({
            q: `name = '${APP_NAME}' and mimeType = '${FILETYPE.FOLDER}' and trashed = false`,
            pageSize: 1,
            fields: "files(id, name)"
        }).then(res => res.data.files)
    }

    private static async createHomeFolder() {
        return GDrive.gDrive.files.create({
            requestBody: {
                name: APP_NAME,
                description: "Your synced appdata is stored here! Source: AppdataSync https://github.com/Zachareee/AppdataSync",
                mimeType: FILETYPE.FOLDER
            }, fields: "id, name"
        }).then(file => file.data)
    }

    private static async updateFile(pathName: string, id: string) {
        return GDrive.gDrive.files.update(this.createUploadBody(pathName, id))
    }

    private static async deleteFile(fileId: string) {
        return GDrive.gDrive.files.delete({ fileId })
    }

    private static async createFile(pathName: string) {
        return GDrive.gDrive.files.create(this.createUploadBody(pathName))
    }

    private static createUploadBody(pathName: string, fileId?: string) {
        return {
            requestBody: {
                name: `${pathName}.gzip`,
                parents: fileId ? undefined : [GDrive.homeFolder],
            },
            media: {
                body: Readable.from(<Buffer>c({
                    gzip: true,
                    sync: true,
                    cwd: APPDATA_PATH
                }, [pathName]).read()),
            },
            uploadType: "multipart",
            fileId
        }
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
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials/GAPI.json');

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
    const content = await fs.readFile(CREDENTIALS_PATH, "ascii");
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
            keyfilePath: CREDENTIALS_PATH,
        }).then(saveCredentials)
    }
}