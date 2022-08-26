import { GoogleApi } from "./google-api";

export class DataStore {
  googleApi = new GoogleApi();

  async init() {
    await this.googleApi.init();
  }
}
