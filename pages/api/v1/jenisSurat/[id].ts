import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "PUT") {
    // TODO: update jenis surat?
    res.end();
  }

  if (req.method === "DELETE") {
    try {
      await db
        .collection("jenisSurat")
        .doc(req.query.id as string)
        .delete();

      res.status(200).json({ message: "Jenis Surat sudah dihapuskan" });
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
