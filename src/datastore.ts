export {
  base64ToBlob,
  blobToStoredArrayBuffer,
  storedArrayBufferToBlob,
  blobToBase64,
} from "./convert";

import { IdbStore } from "./stores/idb-store";
import { FirebaseStore } from "./stores/firebase-store";

export class DataStore<D> {
  idbStore: IdbStore<D>;
  firebaseStore: FirebaseStore<D>;

  constructor(appId: string) {
    this.idbStore = new IdbStore(appId);
    this.firebaseStore = new FirebaseStore(appId);
  }

  private validateProjectId(projectId: string): void {
    if (projectId.trim() === "") {
      throw new Error(`Invalid project id`);
    }
  }

  private validateAssetName(assetName: string): void {
    if (assetName.trim() === "") {
      throw new Error(`Invalid asset name`);
    }
  }

  async signIn(): Promise<void> {
    return this.firebaseStore.signIn();
  }

  async listProjects(): Promise<string[]> {
    return this.firebaseStore.listProjects();
  }

  async listProjectAssets(projectId: string): Promise<string[]> {
    this.validateProjectId(projectId);
    return this.firebaseStore.listProjectAssets(projectId);
  }

  async loadProjectData(projectId: string): Promise<D | null> {
    this.validateProjectId(projectId);
    return this.firebaseStore.loadProjectData(projectId);
  }

  async loadProjectAsset(projectId: string, assetName: string): Promise<Blob> {
    this.validateProjectId(projectId);
    this.validateAssetName(assetName);
    return this.firebaseStore.loadProjectAsset(projectId, assetName);
  }

  async saveProjectData(projectId: string, data: D): Promise<void> {
    this.validateProjectId(projectId);
    return this.firebaseStore.saveProjectData(projectId, data);
  }

  async saveProjectAsset(projectId: string, assetName: string, blob: Blob) {
    this.validateProjectId(projectId);
    this.validateAssetName(assetName);
    return this.firebaseStore.saveProjectAsset(projectId, assetName, blob);
  }
}
