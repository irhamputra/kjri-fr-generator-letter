import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const docs = await db
        .collection("SuratTugas")
        .doc(req.query.id as string)
        .get();

      const data = docs.data();
      const time = {
        createdAt: data?.createdAt.toDate() ?? new Date(),
        editedAt: data?.editedAt.toDate() ?? new Date(),
      };
      const result = { ...data, ...time };

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "DELETE") {
    try {
      await db
        .collection("SuratTugas")
        .doc(req.query.id as string)
        .delete();

      res.status(200).json({ message: "data deleted successfully" });
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
