import { NextApiRequest, NextApiResponse } from "next";
import { storage } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await cors(req, res);

    if (req.method === "POST") {
        try {
            const { destination } = req.body;
            const storageRef = storage.bucket();
            const fileRef = storageRef.file(destination);

            const signedUrls = await fileRef.getSignedUrl({
                action: "read",
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes,
            });

            res.status(200).json({
                message: "Download surat",
                url: signedUrls[0],
            });

            res.end();
        } catch (e) {
            res.status(500).json({ error: e.message });
            res.end();
        }
    }
};
