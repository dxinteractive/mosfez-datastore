import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
  listAll,
  uploadBytes,
} from "firebase/storage";
import type { StorageReference } from "firebase/storage";

// files: https://console.firebase.google.com/project/mosfez-firebase/storage/mosfez-firebase.appspot.com/files
// config:
const firebaseConfig = {
  apiKey: "AIzaSyCtAWBOuZGPBJUyp4ok4s8iDYRC1st0Wmk",
  authDomain: "mosfez-firebase.firebaseapp.com",
  projectId: "mosfez-firebase",
  storageBucket: "mosfez-firebase.appspot.com",
  messagingSenderId: "386806644130",
  appId: "1:386806644130:web:49411b6030226cc112c6fb",
};

export class FirebaseStore<D> {
  appId = "";
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth();
  storage = getStorage(this.firebaseApp);

  signedIn = false;
  user: User | null = null;

  constructor(appId: string) {
    this.appId = appId;

    onAuthStateChanged(this.auth, (u) => {
      console.log("auth state changed", u);
      this.user = u;
    });
  }

  async signIn(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await setPersistence(this.auth, browserLocalPersistence);

    // wait a sec for onAuthStateChanged() to be possibly called first
    await new Promise((r) => setTimeout(r, 1000));

    if (this.signedIn) return;
    await signInWithPopup(this.auth, provider);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  private async getUserOrSignIn(): Promise<User> {
    if (this.user) return this.user;

    await this.signIn();
    const user = this.user;
    if (!user) {
      throw new Error("No user found after sign in");
    }
    return user;
  }

  private async getRef(path: string[] = []): Promise<StorageReference> {
    const user = await this.getUserOrSignIn();
    return await ref(
      this.storage,
      `/${user.uid}/${this.appId}/${path.join("/")}`
    );
  }

  // private async isValidProject(projectId: string) {
  //   const allProjects = await this.listProjects();
  //   return allProjects.includes(projectId);
  // }

  async listProjects(): Promise<string[]> {
    const pathRef = await this.getRef();
    const result = await listAll(pathRef);
    return result.prefixes.map((prefix) => prefix.name);
  }

  async listProjectAssets(projectId: string): Promise<string[]> {
    const ref = await this.getRef([projectId, "assets"]);
    const result = await listAll(ref);
    return result.items.map((item) => item.name);
  }

  async loadProjectData(projectId: string): Promise<D | null> {
    const ref = await this.getRef([projectId, "data.json"]);
    const url = await getDownloadURL(ref);
    const response = await fetch(url);
    const text = await response.text();
    return JSON.parse(text);
  }

  async loadProjectAsset(projectId: string, assetName: string): Promise<Blob> {
    const ref = await this.getRef([projectId, "assets", assetName]);
    const url = await getDownloadURL(ref);
    const response = await fetch(url);
    return await response.blob();
  }

  async saveProjectData(projectId: string, data: D): Promise<void> {
    const ref = await this.getRef([projectId, "data.json"]);
    const string = JSON.stringify(data, null, 2);
    await uploadString(ref, string);
  }

  async saveProjectAsset(projectId: string, assetName: string, blob: Blob) {
    const ref = await this.getRef([projectId, "assets", assetName]);
    await uploadBytes(ref, blob);
  }
}
