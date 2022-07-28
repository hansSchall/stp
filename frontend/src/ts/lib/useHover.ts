import { useState } from "react"

export function useHover(): [boolean,
    {
        onMouseEnter(): void,
        onMouseLeave(): void
    }] {
    const [hovered, setHover] = useState(false);
    return [hovered, {
        onMouseEnter() {
            setHover(true);
        },
        onMouseLeave() {
            setHover(false);
        }
    }]
}