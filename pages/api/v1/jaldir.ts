import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      let result = [];
      const snapshot = await db.collection("JalDir").get();

      snapshot.forEach((doc) => {
        result.push(doc.data());
      });

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.end();
    }
  }

  if (req.method === "POST") {
    try {
      await db.collection("JalDir").add(req.body);
      res.status(200).json({ message: "Data berhasil disimpan" });
      res.end();
    } catch (e) {
      res.end();
    }
  }
};
