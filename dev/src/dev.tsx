import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./css/base.css";
import classes from "./dev.module.css";

import { DataStore } from "mosfez-datastore";

const img = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==`;

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

  const handleList = async () => {
    const projectIds = await datastore.listProjects();
    console.log("projectIds", projectIds);
  };

  const handleLoadData = async () => {
    const projectId = prompt("Project id:") ?? "";
    const result = await datastore.loadProjectData(projectId);
    setData(result);
  };

  const handleLoadAssets = async () => {
    const projectId = prompt("Project id:") ?? "";
    const result = await datastore.loadProjectAssets(projectId);
    console.log("handleLoadAssets", result);
  };

  const handleSave = async () => {
    const projectId = prompt("Project id:") ?? "";
    await datastore.saveProjectData(projectId, {
      wee: Math.random(),
      woo: true,
    });
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
      <div onClick={handleList}>list</div>
      <div onClick={handleLoadData}>load data</div>
      <div onClick={handleLoadAssets}>load assets</div>
      <div onClick={handleSave}>save</div>
      <pre>{JSON.stringify(data)}</pre>
      <img src={img} />
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
