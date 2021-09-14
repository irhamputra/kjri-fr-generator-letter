import { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "../../../utils/firebase";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      await db.collection("SuratTugas").doc("--stats--").set({
        counter: 0,
      });

      await db.collection("SuratKeluar").doc("--stats--").set({
        counter: 0,
      });

      res.status(200).json({ message: "Reset surat telah berhasil!" });
      return res.end();
    } catch (e) {
      res.status(500).json({ message: "Terjadi kesalahan teknis. Mohon coba kembali!" });
      return res.end();
    }
  }
};
