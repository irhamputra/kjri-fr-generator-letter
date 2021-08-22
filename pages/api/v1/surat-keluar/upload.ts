import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { storage } from "../../../../utils/firebase";
import formidable from "formidable";
import { cors } from "../../../../utils/middlewares";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  if (req.method === "POST" || req.method === "PUT") {
    try {
      const data = await new Promise((resolve, reject) => {
        const form = formidable();
        form.parse(req, (err: any, fields: any, files: any) => {
          if (err) reject({ err });
          resolve({ err, fields, files });
        });
      });
      const { files, fields } = data as any;
      const file = files.file;
      const storageRef = storage.bucket();
      const nomorSurat = (fields.nomorSurat as string).replace(/[/\\?%*:|"<>\s]/g, "_");
      const fileName = (file.name as string).replace(/[/\\?%*:|"<>\s]/g, "_");
      const dest = `surat-keluar/${nomorSurat}_${fileName}`;
      // const fileRef = storageRef.file(`surat-keluar/${uid}.${ext}`);
      const upload = await storageRef.upload(file.path, {
        destination: dest,
        metadata: {
          cacheControl: "public,max-age=31536000",
          contentType: file.type,
        },
      });
      res.status(201).json({
        message: "Surat Keluar berhasil dibuat",
        url: dest,
        metadata: upload[0].metadata,
      });
      res.end();
    } catch (e) {
      res.status(400).json({ error: e.message });
      res.end();
    }
  }
};
