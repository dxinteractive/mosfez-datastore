import { get, set, keys } from "idb-keyval";
// import { base64ToBlob } from "./convert";

export class DataStore<D> {
  private _appId = "";
  idbPrefix = "mosfez";

  constructor(appId: string) {
    this._appId = appId;
  }

  async listProjects(): Promise<string[]> {
    const projectIds = (await keys())
      .map((name) => `${name}`.split("/"))
      .filter(
        ([idbPrefix, appId, , type]) =>
          idbPrefix === this.idbPrefix &&
          appId === this._appId &&
          type === "data"
      )
      .map((parts) => parts[2]);

    return Array.from(new Set(projectIds));
  }

  async listProjectAssets(projectId: string): Promise<string[]> {
    const projectIds = (await keys())
      .map((name) => `${name}`.split("/"))
      .filter(
        ([idbPrefix, appId, thisProjectId, type]) =>
          idbPrefix === this.idbPrefix &&
          appId === this._appId &&
          projectId === thisProjectId &&
          type === "asset"
      )
      .map((parts) => parts[4]);

    return Array.from(new Set(projectIds));
  }

  async loadProjectData(projectId: string): Promise<D> {
    const result = await get(
      `${this.idbPrefix}/${this._appId}/${projectId}/data`
    );
    return result;
  }

  async loadProjectAssets(projectId: string): Promise<D> {
    const result = await get(
      `${this.idbPrefix}/${this._appId}/${projectId}/data`
    );
    return result;
  }

  async saveProjectData(projectId: string, data: D): Promise<void> {
    await set(`${this.idbPrefix}/${this._appId}/${projectId}/data`, data);
  }
}
