import { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../../../utils/middlewares";
import { db } from "../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    const { identityNumber } = req.body;

    try {
      const data: FirebaseFirestore.DocumentData = [];
      const snapshot = await db.collection("Users").where("codeId", "==", identityNumber).limit(1).get();

      snapshot.forEach((doc) => {
        data.push(doc.data());
      });

      const result = data.reduce(
        (acc: Array<Record<string, string>>, curr: Record<string, string>) => ({ ...acc, ...curr }),
        {}
      );

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
