import { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../../../../../utils/middlewares";
import { db } from "../../../../../utils/firebase";
import { createSignedUrl } from "../../../../../utils/firebase/storageUtils";
import { SuratKeluarCollection } from "../../../../../typings/SuratKeluar";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  if (req.method === "GET") {
    try {
      const data = await db
        .collection("SuratKeluar")
        .doc(req.query.id as string)
        .get();

      const url = (data.data() as SuratKeluarCollection).url;

      if (!url) {
        res.status(400).json({ error: "This document did'nt have download URL" });
        res.end();
        return;
      }

      const signedUrl = await createSignedUrl(url);

      res.status(201).json({
        message: "Your download is ready",
        url: signedUrl,
      });
      res.end();
    } catch (e) {
      res.status(400).json({ error: e.message });
      res.end();
    }
  }
};
