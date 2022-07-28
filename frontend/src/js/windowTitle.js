import { $_, windowLoad } from "./lib/utils";
import { waitFor } from "./lib/waitFor";
let currentWindowTitle;
let lastSetWindowTitle;
export function WindowTitle({ title: newTitle }) {
    lastSetWindowTitle = newTitle;
    React.useEffect(() => {
        if (lastSetWindowTitle !== currentWindowTitle) {
            waitFor(windowLoad).then(() => {
                $_("#win-title").innerText = lastSetWindowTitle;
                document.title = lastSetWindowTitle;
            });
            currentWindowTitle = lastSetWindowTitle;
        }
    });
    return React.createElement(React.Fragment, null);
}
