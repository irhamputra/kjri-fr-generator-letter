import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const data = await db
        .collection("JalDis")
        .doc(req.query.id as string)
        .get();

      const result = data.data();

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.end();
    }
  }

  if (req.method === "DELETE") {
    try {
      await db
        .collection("JalDis")
        .doc(req.query.id as string)
        .delete();

      res.status(200).json({ message: "Golongan berhasil dihapus" });
      res.end();
    } catch (e) {
      res.end();
    }
  }
};
