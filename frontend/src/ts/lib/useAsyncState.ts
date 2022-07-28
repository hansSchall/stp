import { useState } from "react";

export default function useAsyncState<T, D>(fn: () => Promise<T>, defaultValue: D) {
    const [state, setState] = useState<T | D>()
}