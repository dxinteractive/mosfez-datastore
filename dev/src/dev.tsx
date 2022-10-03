import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./css/base.css";
import classes from "./dev.module.css";

import { blobToBase64, base64ToBlob, DataStore } from "mosfez-datastore";

async function getTestImage() {
  const img = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==`;
  return await base64ToBlob(img);
}

type Thing = {
  wee: number;
  woo: boolean;
};

const datastore = new DataStore<Thing>("testing.projects");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

function Main() {
  const [data, setData] = useState<Thing | null>(null);
  const [imgData, setImgData] = useState("");

  const handleSignIn = async () => {
    await datastore.signIn();
  };

  const handleListProjects = async () => {
    const projectIds = await datastore.listProjects();
    console.log("projectIds", projectIds);
  };

  const handleLoadData = async () => {
    const projectId = prompt("Project id:") ?? "";
    if (!projectId) return;

    const result = await datastore.loadProjectData(projectId);
    setData(result);
  };

  const handleListAssets = async () => {
    const projectId = prompt("Project id:") ?? "";
    if (!projectId) return;

    const result = await datastore.listProjectAssets(projectId);
    console.log("handleListAssets", result);
  };

  const handleLoadAsset = async () => {
    const projectId = prompt("Project id:") ?? "";
    const assetName = prompt("Asset name:") ?? "";
    if (!projectId || !assetName) return;

    const blob = await datastore.loadProjectAsset(projectId, assetName);
    const result = await blobToBase64(blob);
    setImgData(result ?? "");
  };

  const handleSaveData = async () => {
    const projectId = prompt("Project id:") ?? "";
    if (!projectId) return;

    await datastore.saveProjectData(projectId, {
      wee: Math.random(),
      woo: true,
    });
  };

  const handleSaveAsset = async () => {
    const projectId = prompt("Project id:") ?? "";
    const assetName = prompt("Asset id:") ?? "";
    if (!projectId || !assetName) return;

    const blob = await getTestImage();
    await datastore.saveProjectAsset(projectId, assetName, blob);
  };

  return (
    <div className={classes.main}>
      <Header>
        mosfez-datastore dev -{" "}
        <a
          className={classes.link}
          href="https://github.com/dxinteractive/mosfez-datastore"
        >
          github repo
        </a>
      </Header>
      <div onClick={handleSignIn}>sign in</div>
      <div onClick={handleListProjects}>list</div>
      <div onClick={handleLoadData}>load data</div>
      <div onClick={handleListAssets}>list assets</div>
      <div onClick={handleLoadAsset}>load asset</div>
      <div onClick={handleSaveData}>save data</div>
      <div onClick={handleSaveAsset}>save asset</div>
      <pre>{JSON.stringify(data)}</pre>
      <img src={imgData} />
    </div>
  );
}

type HeaderProps = {
  children: React.ReactNode;
};

function Header(props: HeaderProps) {
  return (
    <header className={classes.dspHeader}>
      <div className={classes.dspHeaderTitle}>{props.children}</div>
    </header>
  );
}
