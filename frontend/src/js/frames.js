export function Frames() {
    const [splitting, setSplitting] = React.useState([
        {
            flex: 1,
            content: [
                {
                    flex: 1,
                    content: {
                        tabs: [
                            "test",
                            "ML Controls"
                        ]
                    }
                },
                {
                    flex: 1,
                    content: {
                        tabs: [
                            "test",
                            "ML Controls"
                        ]
                    }
                },
                {
                    flex: 1,
                    content: {
                        tabs: [
                            "test",
                            "ML Controls"
                        ]
                    }
                },
            ]
        },
        {
            flex: 2,
            content: {
                tabs: [
                    "test",
                    "ML Controls"
                ]
            }
        }
    ]);
    const [editing, setEditMode] = React.useState(true);
    function getRecurse(arr, index) {
        let current = arr;
        while (index.length) {
            const n = current[index.shift() || 0].content;
            if (n instanceof Array)
                current = n;
            else
                return current;
        }
        return current;
    }
    return React.createElement("main", { className: "frames" },
        React.createElement(Frame, { splitting: splitting, flex: 1, dir: "row", edit: {
                editing,
                insertBefore(before) {
                    console.log("inserting", before);
                    const index = before.pop();
                    const spcp = [...splitting];
                    // getRecurse(splitting, before)
                    //     .splice(index, 0, {
                    //     flex: 1,
                    //     content: {
                    //         tabs: []
                    //     }
                    // })
                    // setSplitting(splitting);
                }
            }, index: [0] }));
}
function Frame(props) {
    return React.createElement(React.Fragment, null,
        props.edit.editing && props.firstEl ? React.createElement("div", { className: "insert-frame", onClick: () => {
                const a = [...props.index];
                a.last = 0;
                props.edit.insertBefore(a);
            } }, "+") : null,
        React.createElement("div", { className: "frame flex-dir-" + props.dir, style: {
                flexGrow: props.flex,
                flexShrink: props.flex,
            } }, props.tabs ? React.createElement(TabFrame, { tabs: props.tabs, edit: props.edit, index: props.index }) : props.splitting.map((area, index) => {
            const type = area.content instanceof Array;
            return React.createElement(Frame, { splitting: area.content instanceof Array ? area.content : [], flex: area.flex, dir: switchDir(props.dir), edit: props.edit, index: [...props.index, index], tabs: area.content instanceof Array ? undefined : area.content, firstEl: !index, key: [...props.index, index].toString() });
        })
        // <TabFrame
        //     // tabs={"tabs" in area.content ? area.content.tabs : []}
        //     flex={area.flex}
        //     editing={props.editing}
        //     index={[...props.index, index]}
        // ></TabFrame>)
        ),
        props.edit.editing && props.index.length > 1 ? React.createElement("div", { className: "insert-frame", onClick: () => {
                const a = [...props.index];
                a.last++;
                props.edit.insertBefore(a);
            } }, "+") : null);
}
function TabFrame(props) {
    return React.createElement("div", { className: "tab-frame" },
        props.index.join("."),
        props.edit.editing ? null : props.tabs.tabs.map(_ => React.createElement("div", null, _)));
}
const switchDir = (dir) => dir == "column" ? "row" : "column";
