import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    const snapshot = await db
      .collection("Arsip")
      .orderBy("jenisArsip", "asc")
      .get();
    let result = [];

    snapshot.forEach((doc) => {
      result.push(doc.data());
    });

    res.status(200).json(result);
    res.end();
  }

  if (req.method === "POST") {
    const { arsipId } = req.body;

    try {
      await db.collection("Arsip").doc(arsipId).set(req.body);

      res.status(200).json({ message: "Berhasil membuat Arsip!" });
      res.end();
    } catch (e) {
      res.status(500).json({ error: "Terjadi kesalahan" });
      res.end();
    }
  }
};
