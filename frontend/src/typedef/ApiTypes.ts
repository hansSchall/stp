import { Type } from "@sinclair/typebox";

const MethodIncoming = Type.Object({
    resendTVSheetList: Type.Boolean(),
    deleteTVSheet: Type.Integer(),
    addTVSheet: Type.String(),
});

const MethodOutgoing = Type.Object({
    tvSheetList: Type.Array(Type.Object({
        id: Type.Integer(),
        label: Type.String(),
    }))
});

const MethodBiDir = Type.Object({

});

export const ApiIDType = Type.String();

export const ApiIncoming = Type.Object({
    tx: Type.Partial(Type.Composite([MethodIncoming, MethodBiDir])),
    reqID: Type.Optional(ApiIDType),
    resID: Type.Optional(ApiIDType),
});

export const ApiOutgoing = Type.Object({
    tx: Type.Partial(Type.Composite([MethodOutgoing, MethodBiDir])),
    reqID: Type.Optional(ApiIDType),
    resID: Type.Optional(ApiIDType),
});
