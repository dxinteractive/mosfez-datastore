import React from "react";
import ReactDOM from "react-dom/client";
import "./css/base.css";
import classes from "./dev.module.css";

import { DataStore } from "mosfez-datastore";

const store = new DataStore();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

const handleClick = async () => {
  console.log("go");
  await store.init();
  console.log("init");
  const thing = await store.googleApi.listFiles();
  console.log("thing", thing);
};

function Main() {
  return (
    <div className={classes.main}>
      <ListHeader>
        mosfez-datastore dev -{" "}
        <a
          className={classes.link}
          href="https://github.com/dxinteractive/mosfez-datastore"
        >
          github repo
        </a>
      </ListHeader>
      <div onClick={handleClick}>click</div>
    </div>
  );
}

type ListHeaderProps = {
  children: React.ReactNode;
};

function ListHeader(props: ListHeaderProps) {
  return (
    <header className={classes.dspHeader}>
      <div className={classes.dspHeaderTitle}>{props.children}</div>
    </header>
  );
}
