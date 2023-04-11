import React, { MutableRefObject, PropsWithChildren, RefObject, createContext, useContext, useEffect, useRef, useState } from "react";
import { tablist } from "../../exportonly";
import Hammer from "react-hammerjs"
import { add, mul, sub, vec2 } from "../tabs/trackView/vec2";

function preventDefault(ev: Event) {
    ev.preventDefault();
}

interface PosDef {
    posX: number,
    posY: number,
    scale: number,
    offX: number,
    offY: number,
    startScale: number,
}

function emptyPosDef(): PosDef {
    return {
        posX: 0,
        posY: 0,
        scale: 1,
        offX: 0,
        offY: 0,
        startScale: 1,
    }
}

type PosDefRef = MutableRefObject<PosDef>;

class USVController {
    constructor(private readonly refPos: PosDefRef, private readonly container: MutableRefObject<HTMLDivElement | null>, private readonly renderRef: VoidFunction) {

    }
    private DEFAULT_MOVE_AMOUNT() {
        return 5 * 16 * (1 / this.refPos.current.scale);
    }
    public zoomIn() {
        this.applyZoomDiff(1.1);
    }
    public zoomOut() {
        this.applyZoomDiff(.9);
    }
    public moveLeft() {
        this.refPos.current.posX += -this.DEFAULT_MOVE_AMOUNT();
        this.renderRef();
    }
    public moveRight() {
        this.refPos.current.posX += this.DEFAULT_MOVE_AMOUNT();
        this.renderRef();
    }
    public moveUp() {
        this.refPos.current.posY += -this.DEFAULT_MOVE_AMOUNT();
        this.renderRef();
    }
    public moveDown() {
        this.refPos.current.posY += this.DEFAULT_MOVE_AMOUNT();
        this.renderRef();
    }
    public applyZoomDiff(amount: number) { // scale *= amount
        const prevCenter = this.getCenterPoint();
        this.refPos.current.scale *= amount;
        this.centerViewOn(prevCenter, this.refPos.current.scale);
    }
    private getUnitPointOfPx(pos: vec2) {
        return mul(pos, 1 / (this.refPos.current.scale * 16));
    }
    private getPxOfUnitPoint(pos: vec2, zoomOverride?: number) {
        return mul(pos, (zoomOverride || this.refPos.current.scale) * 16);
    }
    private getCenterPoint() {
        const viewArea = this.container.current?.getBoundingClientRect();
        if (viewArea) {
            const tl = vec2(viewArea.x, viewArea.y);
            const wh = vec2(viewArea.width, viewArea.height);
            const center = add(tl, mul(wh, 0.5));
            return this.getUnitPointOfPx(sub(center, vec2(this.refPos.current.posX, this.refPos.current.posY)))
        } else {
            console.warn("[InternalError] [ShouldNotHappen] [ignored] [userScaledView.tsx::USVController::getCenterPoint()] 'viewArea' eveluated to false; returning vec2(0,0); container=", this.container);
            return vec2(0, 0);
        }
    }
    public centerViewOn(pos: vec2, zoomOverride?: number) {
        const viewArea = this.container.current?.getBoundingClientRect();
        if (viewArea) {
            const tl = vec2(viewArea.x, viewArea.y);
            const wh = vec2(viewArea.width, viewArea.height);
            const center = add(tl, mul(wh, 0.5));
            const centerTo = sub(center, this.getPxOfUnitPoint(pos, zoomOverride));
            this.refPos.current.posX = centerTo[0];
            this.refPos.current.posY = centerTo[1];
            this.renderRef();
        } else {
            console.warn("[InternalError] [ShouldNotHappen] [ignored] [userScaledView.tsx::USVController::centerViewOn()] 'viewArea' eveluated to false; did nothing; container=", this.container);
        }
    }
    public homePos() {
        const viewArea = this.container.current?.getBoundingClientRect();
        if (viewArea) {
            const emW = viewArea.width / 16;
            const emH = viewArea.height / 16;
            const viewportWidth = emW - 3 - (false ? 42 : 0);
            const viewportHeight = emH - 5;
            const [contentX, contentY] = this.getContentSize();
            const maxXScale = viewportWidth / contentX;
            const maxYScale = viewportHeight / contentY;
            const scale = Math.min(maxXScale, maxYScale);
            this.refPos.current.scale = scale;
            const [negXContent, negYContent] = this.getTopLeftContent();
            this.centerViewOn(vec2(negXContent + contentX / 2, negYContent + contentY / 2), scale)
        } else {
            console.warn("[InternalError] [ShouldNotHappen] [ignored] [userScaledView.tsx::USVController::homePos()] 'viewArea' eveluated to false; did nothing; container=", this.container);
        }
    }
    private getContentSize(): vec2 {
        // TODO: implement
        return vec2(50, 40); // pseudo values, testing only
    }
    private getTopLeftContent(): vec2 {
        // TODO: implement
        return vec2(0, 0); // pseudo values, testing only
    }
}

interface USVData {
    x: number,
    y: number,
    s: number,
}

const USVDataContext = createContext<USVData>({
    x: 0,
    y: 0,
    s: 1,
})

export function useUSV(): [USVController, USVFrameOptions] {
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [scale, setScale] = useState(1);

    const refPos = useRef(emptyPosDef());

    function renderRef() {
        setPosX(refPos.current.posX);
        setPosY(refPos.current.posY);
        setScale(refPos.current.scale);
    }

    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = container.current;
        if (!el)
            return;

        const evs = ["wheel"];
        for (let ev of evs) {
            el.addEventListener(ev, preventDefault)
        }
        return () => {
            for (let ev of evs) {
                el.removeEventListener(ev, preventDefault)
            }
        }
    }, [container.current]);

    const [controller] = useState(() => new USVController(refPos, container, renderRef));

    return [controller, {
        refPos,
        controller,
        renderRef,
        data: {
            x: posX,
            y: posY,
            s: scale
        },
        container,
    }]
}

interface USVFrameOptions {
    refPos: PosDefRef,
    controller: USVController,
    renderRef: VoidFunction,
    data: USVData,
    container: RefObject<HTMLDivElement>,
}

const USVFrameContext = createContext<USVFrameOptions>({
    refPos: { current: emptyPosDef() },
    controller: new USVController({ current: emptyPosDef() }, { current: null }, () => { }),
    renderRef: () => { },
    data: { x: 0, y: 0, s: 1 },
    container: { current: null }
})

export const USVOptions = USVFrameContext.Provider;

export function USVFrame({ children }: PropsWithChildren) {
    const props = useContext(USVFrameContext);
    return <Hammer
        options={{
            touchAction: "compute",
            recognizers: {
                pinch: {
                    enable: true,
                }
            }
        }}

        onPinchStart={ev => {
            props.refPos.current.startScale = props.refPos.current.scale;
            props.refPos.current.offX = 0;
            props.refPos.current.offY = 0;
        }}

        onPinch={ev => {
            props.controller.applyZoomDiff(props.refPos.current.startScale * ev.scale / props.refPos.current.scale);
            props.refPos.current.posX += ev.deltaX - props.refPos.current.offX;
            props.refPos.current.posY += ev.deltaY - props.refPos.current.offY;
            props.refPos.current.offX = ev.deltaX;
            props.refPos.current.offY = ev.deltaY;
            props.renderRef();
        }}
    >
        <div className="usv-hammer">

            <div className="usv-container" ref={props.container} onWheel={ev => {
                ev.stopPropagation();
                if (ev.ctrlKey) {
                    props.controller.applyZoomDiff(1 - ev.deltaY / 400);
                } else {
                    props.refPos.current.posX += -ev.deltaX;
                    props.refPos.current.posY += -ev.deltaY;
                    props.renderRef();
                }
            }} onMouseMove={ev => {
                if (ev.buttons & 2) {
                    props.refPos.current.posX += ev.movementX;
                    props.refPos.current.posY += ev.movementY;
                    props.renderRef()
                }
            }}>
                <USVDataContext.Provider value={props.data}>
                    {children}
                </USVDataContext.Provider>
            </div>
        </div>
    </Hammer>
}

export function USVContent(props: PropsWithChildren & {
    fontScaling?: boolean,
}) {
    const data = useContext(USVDataContext);
    if (props.fontScaling) {
        return <div className="usv-box" style={{
            left: data.x + "px",
            top: data.y + "px",
            fontSize: data.s + "em",
        }}>{props.children}</div>
    } else {
        return <div className="usv-box" style={{
            left: data.x + "px",
            top: data.y + "px",
            transform: `scale(${data.s * 100}%)`,
        }}>{props.children}</div>
    }
}

export function enableUSVTestTab() {
    function USVTest() {
        const [ctrl, USV] = useUSV();
        return <USVFrameContext.Provider value={USV}>
            <USVFrame>
                <USVContent fontScaling={false}>
                    Test
                </USVContent>
            </USVFrame>
        </USVFrameContext.Provider>
    }

    tablist.set("usvTest", {
        id: "usvTest",
        label: "USV Test",
        comp: USVTest,
    })
}
