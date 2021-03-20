import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const snapshot = await db.collection("Arsip").get();
    let result = [];

    snapshot.forEach((doc) => {
      result.push(doc.data());
    });

    res.status(200).json(result);
    res.end();
  }
  if (req.method === "POST") {
    try {
      await db.collection("Arsip").add(req.body);

      res.status(200).json({ message: "Berhasil membuat Arsip!" });
      res.end();
    } catch (e) {
      res.status(500).json({ error: "Terjadi kesalahan" });
      res.end();
    }
  }
};
