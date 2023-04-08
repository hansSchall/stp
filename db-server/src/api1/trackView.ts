import { Router } from "express";
import { db } from "../datasource";
import { TV_Sheet, TV_Track, TV_Track_Point } from "../model/TrackView";

export const tv = Router();

const tv_sheets = db.getRepository(TV_Sheet);
const tv_tracks = db.getRepository(TV_Track);
const tv_trackPoints = db.getRepository(TV_Track_Point);

tv.get("/sheet/list", async (req, res) => {
    const items = await tv_sheets.find();
    res.json(items.map(item => ({
        id: item.id,
        label: item.label
    })))
})
tv.put("/sheet", async (req, res) => {
    const item = new TV_Sheet();
    console.log(req.body);
    item.label = req.body.label || "unnamed";
    await tv_sheets.save(item);
    res.json({
        id: item.id,
    })
})
tv.delete("/sheet/:id", async (req, res) => {
    const item = await tv_sheets.findOneByOrFail({
        id: parseInt(req.params.id),
    });
    await tv_sheets.remove(item);
    res.status(204).end();
})
function jsonTrack(track: TV_Track) {
    return {
        id: track.id,
        points: track.tracks.sort((a, b) => a.id - b.id).map(point => [point.x, point.y, point.id])
    }
}
tv.get("/sheet/:id/track/list", async (req, res) => {
    const item = await tv_sheets.findOneByOrFail({
        id: parseInt(req.params.id),
    });
    res.json((await item.tracks).map(jsonTrack));
})
tv.get("/track/:id", async (req, res) => {
    const item = await tv_tracks.findOneByOrFail({
        id: parseInt(req.params.id),
    });
    res.json(jsonTrack(item));
})
tv.put("/track", (req, res) => {

})
tv.put("/track/:id/insert", async (req, res) => {
    const id = parseInt(req.params.id);
    await db.transaction(async db => {
        const oldItem = await db.getRepository(TV_Track_Point).findOneByOrFail({
            id,
        })
        await db
            .createQueryBuilder()
            .update(TV_Track_Point)
            .set({
                id: () => "id + 1",
            })
            .where("id >= :id", { id })
            .execute();
        const newItem = new TV_Track_Point();
        newItem.id = id;
        newItem.x = parseFloat(req.body.x || "0") || 0;
        newItem.y = parseFloat(req.body.y || "0") || 0;
        newItem.track = oldItem.track;
        db.save(newItem);
    })
    res.status(204).end();
})
