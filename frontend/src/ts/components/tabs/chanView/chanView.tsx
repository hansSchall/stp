import React from "react";
import { tablist } from "../../../exportonly";
import { chanSymbolMap } from "../../chs/chanSymblMap";
import { Chs } from "../../chs/chs";

export function ChanView() {
    return <>
        <div className="chanv-container">
            <div className="chanv-list">
                {[...chanSymbolMap].map(([id], ind) => <div className="chanv-item" key={id}>
                    <div className="chanv-id">{ind + 1}</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <Chs id={id} />
                        </div>
                    </div>
                </div>)}
                {/* <div className="chanv-item">
                    <div className="chanv-id">1</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-w-fm -ia" />
                            <div className="chs-w-tr -a" />
                            <div className="chs-w-bm -a" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">2</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-w-fm -ia" />
                            <div className="chs-w-tl -a" />
                            <div className="chs-w-bm -a" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">3</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-w-tr -ia" />
                            <div className="chs-w-fm -a" />
                            <div className="chs-w-bm -a" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">4</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-w-tr -ia" />
                            <div className="chs-w-fm -ah" />
                            <div className="chs-w-bm -ah" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">5</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-s-rt-l -l" />
                            <div className="chs-s-rt-r -l" />
                            <div className="chs-s-gn -ia" />
                            <div className="chs-s-ge -ia" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">5</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-s-rt-l -l" />
                            <div className="chs-s-rt-r -ia" />
                            <div className="chs-s-gn -ia" />
                            <div className="chs-s-ge -ia" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">5</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-s-rt-l -ia" />
                            <div className="chs-s-rt-r -ia" />
                            <div className="chs-s-gn -ia" />
                            <div className="chs-s-ge -l" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">5</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-s-rt-l -ia" />
                            <div className="chs-s-rt-r -ia" />
                            <div className="chs-s-gn -l" />
                            <div className="chs-s-ge -ia" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">6</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-b-i" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">7</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-b-o" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">8</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-bel" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">9</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-unbel" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">10</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-s-rt-ml -ia" />
                            <div className="chs-s-rt-mr -ia" />
                            <div className="chs-s-ws-1" />
                            <div className="chs-s-ws-2" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">10</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-s-rt-ml" />
                            <div className="chs-s-rt-mr" />
                            <div className="chs-s-ws-1 -ia" />
                            <div className="chs-s-ws-2 -ia" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">11</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-wv-base" />
                            <div className="chs-wv-ninv" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">12</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">
                            <div className="chs-wv-base" />
                            <div className="chs-wv-inv" />
                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">13</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">

                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">14</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">

                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">15</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">

                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">16</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">

                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">17</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">

                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">18</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">

                        </div>
                    </div>
                </div>
                <div className="chanv-item">
                    <div className="chanv-id">19</div>
                    <div className="chanv-symbl">
                        <div className="chs-box">

                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    </>
}

tablist.set("chanView", {
    id: "chanView",
    label: "Chan View",
    comp: ChanView,
})
