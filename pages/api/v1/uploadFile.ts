import { NextApiRequest, NextApiResponse } from "next";
import { db, storage } from "../../../utils/firebase";
import { cors, upload } from "../../../utils/middlewares";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      console.log(req.body);
      const file = storage.file(`test-surat/test1.pdf`);

      await file.save(req.body.surat[0].path);
      await file.get();

      res.status(200).json({ message: "Upload berhasil" });
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
