import { LoadBar } from "../../loadBar";
import { WindowTitle } from "../../windowTitle";
export function MS(props) {
    // let loaded = false;
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        fetch("/data/ms-2.json").then(res => {
            res.json().then(setData);
        });
    }, [props.id]);
    if (data) {
        return React.createElement(React.Fragment, null,
            React.createElement(WindowTitle, { title: `MS '${props.id}'` }),
            React.createElement("div", null));
    }
    else {
        return React.createElement(React.Fragment, null,
            React.createElement(LoadBar, { label: `loading MagicSheet '${props.id}'` }));
    }
}
