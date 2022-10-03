import { get, set, keys } from "idb-keyval";
import { blobToStoredArrayBuffer, storedArrayBufferToBlob } from "../convert";

export class IdbStore<D> {
  appId = "";
  idbPrefix = "mosfez";

  constructor(appId: string) {
    this.appId = appId;
  }

  async listProjects(): Promise<string[]> {
    const projectIds = (await keys())
      .map((name) => `${name}`.split("/"))
      .filter(
        ([idbPrefix, appId, projectId, type]) =>
          idbPrefix === this.idbPrefix &&
          appId === this.appId &&
          type === "data" &&
          projectId
      )
      .map((parts) => parts[2]);

    return Array.from(new Set(projectIds));
  }

  async listProjectAssets(projectId: string): Promise<string[]> {
    const assetNames = (await keys())
      .map((name) => `${name}`.split("/"))
      .filter(
        ([idbPrefix, appId, thisProjectId, type]) =>
          idbPrefix === this.idbPrefix &&
          appId === this.appId &&
          projectId === thisProjectId &&
          type === "asset"
      )
      .map((parts) => parts[4]);

    return Array.from(new Set(assetNames));
  }

  async loadProjectData(projectId: string): Promise<D | null> {
    const result = await get(
      `${this.idbPrefix}/${this.appId}/${projectId}/data`
    );
    return result;
  }

  async loadProjectAsset(projectId: string, assetName: string): Promise<Blob> {
    const result = await get(
      `${this.idbPrefix}/${this.appId}/${projectId}/asset/${assetName}`
    );
    if (!result) {
      throw new Error("Could not load asset");
    }
    return await storedArrayBufferToBlob(result);
  }

  async saveProjectData(projectId: string, data: D): Promise<void> {
    await set(`${this.idbPrefix}/${this.appId}/${projectId}/data`, data);
  }

  async saveProjectAsset(projectId: string, assetName: string, blob: Blob) {
    const storedArrayBuffer = await blobToStoredArrayBuffer(blob);
    await set(
      `${this.idbPrefix}/${this.appId}/${projectId}/asset/${assetName}`,
      storedArrayBuffer
    );
  }
}
