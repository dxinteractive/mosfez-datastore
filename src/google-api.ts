import googleOneTap from "google-one-tap";
import { loadGapiInsideDOM } from "gapi-script";

// mosfez-datastore-client
const client_id =
  "857300403927-e2g40elluaj1es7ovehsqf7absa56ln6.apps.googleusercontent.com";

async function loadGapi() {
  await loadGapiInsideDOM();
  return gapi;
}

type GoogleOneTapResponse = {
  clientId: string;
  credential: string;
  select_by: string;
};

async function loadGis(): Promise<GoogleOneTapResponse> {
  return new Promise((resolve) =>
    googleOneTap({ client_id, auto_select: true }, resolve)
  );
}

type TokenClient = {
  requestAccessToken: () => void;
  callback: (resp: { error?: unknown }) => void;
};

function initTokenClient(): TokenClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { google } = <any>window;
  if (!google) throw new Error("google not found on window");

  return google.accounts.oauth2.initTokenClient({
    client_id: client_id,
    scope: "https://www.googleapis.com/auth/drive",
    prompt: "consent",
    callback: "", // defined at request time in await/promise scope.
  });
}

type DriveFields = {
  fields: string;
  q: string;
};

type DriveResult = {
  code: number;
  data: unknown;
  error: unknown;
  message: string;
};

type Drive = {
  files: {
    list: (fields: DriveFields) => {
      execute: (callback: (result: DriveResult) => void) => void;
    };
  };
};

type DriveRequester = (drive: Drive) => Promise<DriveResult>;

export class GoogleApi {
  gapi?: typeof globalThis.gapi;
  tokenClient?: TokenClient;

  getGapi(): typeof globalThis.gapi {
    const { gapi } = this;
    if (!gapi) throw new Error("gapi not loaded");
    return gapi;
  }

  async init() {
    const gapi = await loadGapi();
    this.gapi = gapi;

    await new Promise((callback, onerror) => {
      gapi.load("client", { callback, onerror });
    });

    await gapi.client.init({});

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    gapi.client.load(
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
    );

    await loadGis();

    this.tokenClient = initTokenClient();
  }

  async getToken() {
    const { tokenClient } = this;
    if (!tokenClient) throw new Error("tokenClient is undefined");

    await new Promise((resolve, reject) => {
      try {
        tokenClient.callback = (resp) => {
          if (resp.error) {
            reject(resp);
          } else {
            resolve(resp);
          }
        };
        tokenClient.requestAccessToken();
      } catch (err) {
        console.log(err);
      }
    });
  }

  async makeDriveRequest(requester: DriveRequester): Promise<DriveResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drive = (this.getGapi().client as any).drive;
    const result = await requester(drive);
    console.log("result", result);
    if (result.code !== 403) {
      return result;
    }
    await this.getToken();
    const result2 = await requester(drive);
    return result2;
  }

  async listFiles() {
    return await this.makeDriveRequest(async (drive) => {
      return await new Promise((resolve) => {
        drive.files
          .list({
            fields: "files(id,version,name)",
            q: "trashed=false",
          })
          .execute(resolve);
      });
    });
  }
}
