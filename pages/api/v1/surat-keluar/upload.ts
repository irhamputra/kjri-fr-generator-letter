import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { db, storage } from "../../../../utils/firebase";
import formidable from "formidable";
import { cors } from "../../../../utils/middlewares";
import fs from "fs";
import { createUrl } from "../../../../utils/firebase/storageUtils";
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  if (req.method === "POST" || req.method === "PUT") {
    try {
      const uid = v4();

      const data = await new Promise((resolve, reject) => {
        const form = formidable();
        form.parse(req, (err: any, fields: any, files: any) => {
          if (err) reject({ err });
          resolve({ err, fields, files });
        });
      });
      const { files } = data as any;
      const file = files.file;
      const ext = file.name.split(".").pop();
      const storageRef = storage.bucket();
      const dest = `surat-keluar/${uid}.${ext}`;
      const uuid = v4();
      // const fileRef = storageRef.file(`surat-keluar/${uid}.${ext}`);
      const upload = await storageRef.upload(file.path, {
        destination: dest,
        metadata: {
          cacheControl: "public,max-age=31536000",
          contentType: file.type,
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      });
      res
        .status(201)
        .json({
          message: "Surat Keluar berhasil dibuat",
          url: createUrl(upload[0].name, uuid),
          metadata: upload[0].metadata,
        });
      res.end();
    } catch (e) {
      res.status(400).json({ error: e.message });

      res.end();
    }
  }
};
