import { promises as fs } from "fs"
import { drive, drive_v3 } from "@googleapis/drive";
import { authenticate } from "@google-cloud/local-auth";
import { OAuth2Client, auth } from "google-auth-library"
import path from "path"

import { CloudProvider, drives } from "../common";
import { TOKEN_FOLDER } from "../utils/paths";

const TOKEN_PATH = `${TOKEN_FOLDER}/${drives["googleDrive"].tokenFile}`

export class GDrive extends CloudProvider {
    private static gDrive: drive_v3.Drive
    private static authClient: OAuth2Client

    static override async init() {
        GDrive.authClient = await authorize()
        GDrive.gDrive = drive({ version: 'v3', auth: GDrive.authClient})
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