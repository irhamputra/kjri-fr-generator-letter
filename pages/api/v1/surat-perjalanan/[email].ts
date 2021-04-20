import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const result = [];
      const snapshot = await db.collection("SuratTugas").get();

      snapshot.forEach((docs) => {
        result.push(docs.data());
      });

      const data = result.filter((v) => {
        return v?.listPegawai?.find?.((d) => {
          return d.pegawai.email === req.query.email;
        });
      });

      res.status(200).json(data);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
