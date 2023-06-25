import { Editor, useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import React, { useEffect, useState } from "react";
import { testScheme } from "./schemaSchema";

export default function MonacoBox(p: {
    schema: URL,
}) {
    const [content, setContent] = useState("");
    const [cachedSchema, setCachedSchema] = useState<any>(null);
    const [schemaState, setSchemaState] = useState("preparing");
    const [markers, setMarkers] = useState<editor.IMarker[]>([]);
    const monaco = useMonaco();
    useEffect(() => {
        setSchemaState("fetching");
        fetch(p.schema).then(res => {
            if (res.ok) {
                res.json().then(json => { setCachedSchema(json); });
                setSchemaState("parsing");
            } else {
                setSchemaState("Error loading schema");
            }
        });
    }, [p.schema]);

    useEffect(() => {
        if (monaco && cachedSchema) {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                schemas: [{
                    uri: "config.json",
                    fileMatch: ['config.json'],
                    schema: cachedSchema,
                }]
            });
            setSchemaState("");
            // theme().then(theme => {
            //     editor.defineTheme('monokai', theme);
            // });
            // monaco.editor.setTheme("monokai");
        }

    }, [monaco, cachedSchema]);
    return <>
        {schemaState ? <div className="schema-state">
            <div className="-box">
                <div className="-label">Loading Config Schema: {schemaState}</div>
            </div>
        </div> : null}
        <div
            className="devt-raw-json"
            onKeyDown={ev => {
                ev.stopPropagation();
                // ev.preventDefault();
            }}
            onKeyUp={ev => ev.stopPropagation()} >
            <div className="devt-monaco-wrapper">

                <Editor
                    language="json"
                    defaultValue={`{
    "a": 5,
    "b": "545"
}`}
                    onChange={val => setContent(val || "")}
                    // theme="vs-dark"
                    options={{
                        theme: "vs-dark",
                        minimap: {
                            enabled: false,
                        },
                        fixedOverflowWidgets: true,
                    }}
                    path="config.json"
                    onValidate={markers => setMarkers(markers)} />
            </div>
        </div>
        <div className="devt-props-err-box">
            {markers.map(marker => <DevtPropsError key={`${marker.message}${marker.startColumn}${marker.endColumn}${marker.startLineNumber}${marker.endLineNumber}`} err={marker} />)}
            {markers.length > 0 ? null : <div className="devt-props-commit">
                <div className="-action">Commit changes</div>
            </div>}
        </div>
    </>;
}

function DevtPropsError(p: {
    err: editor.IMarker,
}) {
    return <div className="devt-props-err">
        <div className="-type">Error</div>
        <div className="-title">{p.err.message}</div>
        <div className="-src">{p.err.owner} [{p.err.startLineNumber}:{p.err.startColumn}]</div>
    </div>;
}
