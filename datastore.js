'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var googleOneTap = require('google-one-tap');
var gapiScript = require('gapi-script');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var googleOneTap__default = /*#__PURE__*/_interopDefaultLegacy(googleOneTap);

const client_id = "857300403927-e2g40elluaj1es7ovehsqf7absa56ln6.apps.googleusercontent.com";
async function loadGapi() {
  await gapiScript.loadGapiInsideDOM();
  return gapiScript.gapi;
}
async function loadGis() {
  return new Promise((resolve) => googleOneTap__default["default"]({ client_id }, resolve));
}
function initTokenClient() {
  const { google } = window;
  if (!google)
    throw new Error("google not found on window");
  return google.accounts.oauth2.initTokenClient({
    client_id,
    scope: "https://www.googleapis.com/auth/drive",
    prompt: "consent",
    callback: ""
  });
}
class GoogleApi {
  async init() {
    const gapi2 = await loadGapi();
    await new Promise((callback, onerror) => {
      gapi2.load("client", { callback, onerror });
    });
    await gapi2.client.init({});
    gapi2.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest");
    await loadGis();
    const tokenClient = initTokenClient();
    console.log("hi", tokenClient);
    async function getToken(err) {
      if (err.result.error.code == 401 || err.result.error.code == 403 && err.result.error.status == "PERMISSION_DENIED") {
        await new Promise((resolve, reject) => {
          try {
            tokenClient.callback = (resp) => {
              if (resp.error !== void 0) {
                reject(resp);
              }
              console.log("gapi.client access token: " + JSON.stringify(gapi2.client.getToken()));
              resolve(resp);
            };
            tokenClient.requestAccessToken();
          } catch (err2) {
            console.log(err2);
          }
        });
      } else {
        throw new Error(err);
      }
    }
    async function listFiles() {
      return await new Promise((resolve) => {
        gapi2.client.drive.files.list({
          pageSize: 10,
          fields: "files(id,version,name)",
          q: "trashed=false"
        }).execute(resolve);
      });
    }
    listFiles().then((response) => console.log(response)).catch((err) => getToken(err)).then(() => listFiles()).then((response) => console.log(response)).catch((err) => console.log(err));
  }
}

class DataStore {
  async init() {
    const g = new GoogleApi();
    await g.init();
  }
}

exports.DataStore = DataStore;
//# sourceMappingURL=datastore.js.map
