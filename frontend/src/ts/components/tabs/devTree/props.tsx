import { Editor, useMonaco } from "@monaco-editor/react";
import { TSchema } from "@sinclair/typebox";
import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { testScheme } from "./schemaSchema";
import { editor } from "monaco-editor";
import { waitFor } from "simple-promise-locks";
// import {editor} from "monaco-editor"

export function DevTreeProps() {
    const [rawView, setRawView] = useState(true);
    return <div className="devt-props">
        <div className="devt-props-tabs">
            <div
                className={"devt-props-tab" + (rawView ? "" : " -active")}
                onClick={setRawView.bind(null, false)}
            >Data</div>
            <div
                className={"devt-props-tab" + (rawView ? " -active" : "")}
                onClick={setRawView.bind(null, true)}
            >JSON</div>
        </div>
        {rawView ? <DevtRawJSON /> : <DevtPropTree editRaw={setRawView.bind(null, true)} />}
        {/* <div className="devt-props-err-box">
            <DevtPropsError msg="test" />
        </div> */}
    </div>;
}

function DevtPropTree(p: {
    editRaw: VoidFunction,
}) {
    return <div className="devt-prop-tree">
        <div className="devt-prop-tree-error">
            <div className="-title">Failed to parse JSON Scheme</div>
            <div className="-action" onClick={p.editRaw}>Edit raw JSON</div>
        </div>
    </div>;
}

import('monaco-themes/themes/Monokai.json')
    .then(data => {
        theme(data as any);
    });

const theme = waitFor<editor.IStandaloneThemeData>();

const MonacoBox = lazy(() => import("./monacoBox"));


function DevtRawJSON() {
    const url = useMemo(() => new URL("/api/test/jsonSchema", location.href), []);
    return <Suspense fallback={<div className="loading">loading Monaco ...</div>}>
        <MonacoBox schema={url}></MonacoBox>
    </Suspense>;
}
