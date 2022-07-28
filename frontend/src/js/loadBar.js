export function LoadBar(props) {
    return React.createElement("div", { className: "fs-loading active" },
        React.createElement("div", null),
        React.createElement("div", null),
        React.createElement("div", null),
        props.label ? React.createElement("div", null, props.label) : null);
}
