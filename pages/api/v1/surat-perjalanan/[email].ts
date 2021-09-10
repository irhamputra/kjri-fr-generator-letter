import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const result: FirebaseFirestore.DocumentData = [];
      const snapshot = await db.collection("SuratTugas").get();

      snapshot.forEach((docs) => {
        const data = docs.data();
        const time = {
          createdAt: data.createdAt?.toDate(),
          editedAt: data.editedAt?.toDate(),
        };
        result.push({ ...data, ...time });
      });

      const data = result.filter((v: { listPegawai: Array<{ pegawai: { email: string } }> }) =>
        v?.listPegawai?.find?.((d) => d.pegawai.email === req.query.email)
      );

      res.status(200).json(data);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
