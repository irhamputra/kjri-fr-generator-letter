import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../../utils/firebase";
import { cors } from "../../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await cors(req, res);

    if (req.method === "GET") {
        try {
            const background = await db.collection("Media").doc("background").get();
            res.status(200).json(background.data());
            res.end();
        } catch (e) {
            res.status(200).json({ error: e.message });
            res.end();
        }
    }

    if (req.method === "POST" || req.method === "PUT") {
        try {
            const { url } = req.body;

            const docRef = db.collection("Media").doc("background");
            await docRef.update({ url });

            res.status(201).json({ message: "Background berhasil di update", url });
            res.end();
        } catch (e) {
            res.status(400).json({ error: e.message });

            res.end();
        }
    }
};
