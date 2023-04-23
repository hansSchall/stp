import { Type } from "@sinclair/typebox";

const MethodIncomming = Type.Object({
    resendTVSheetList: Type.Boolean(),
    deleteTVSheet: Type.Integer(),
    addTVSheet: Type.String(),
})

const MethodOutgoing = Type.Object({
    tvSheetList: Type.Array(Type.Object({
        id: Type.Integer(),
        label: Type.String(),
    }))
})

const MethodBidir = Type.Object({

})

export const ApiIDType = Type.String();

export const ApiIncomming = Type.Object({
    tx: Type.Partial(Type.Composite([MethodIncomming, MethodBidir])),
    reqID: Type.Optional(ApiIDType),
    resID: Type.Optional(ApiIDType),
});

export const ApiOutgoing = Type.Object({
    tx: Type.Partial(Type.Composite([MethodOutgoing, MethodBidir])),
    reqID: Type.Optional(ApiIDType),
    resID: Type.Optional(ApiIDType),
});
