import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const result: FirebaseFirestore.DocumentData = [];
      const snapshot = await db
        .collection("SuratKeluar")
        .orderBy("editedAt", "desc")
        .where("author", "==", req.query.email)
        .get();

      snapshot.forEach((docs) => {
        if (docs.get("content") || docs.get("recepient")) {
          const data = docs.data();
          const time = {
            createdAt: data.createdAt?.toDate(),
            editedAt: data.editedAt?.toDate(),
          };
          result.push({ ...data, ...time });
        }
      });

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
