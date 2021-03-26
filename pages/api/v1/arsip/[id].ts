import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "DELETE") {
    const { id } = req.query;
    await db
      .collection("Arsip")
      .doc(id as string)
      .delete();

    res.status(200).json({ message: "Arsip berhasil dihapus" });
    res.end();
  }
};
