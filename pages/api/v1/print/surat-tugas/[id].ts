import { NextApiRequest, NextApiResponse } from "next";
import { db, storage } from "../../../../../utils/firebase";
import { cors } from "../../../../../utils/middlewares";
import { generateSuratTugas } from "../../../../../utils/docx";
import { SuratTugasRes } from "../../../../../typings/SuratTugas";
import { Packer } from "docx";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const storageRef = storage.bucket();
      const snapshot = await db
        .collection("SuratTugas")
        .doc(id as string)
        .get();

      const { nomorSurat, listPegawai, textTengah, textPembuka, textPenutup } = snapshot.data() as SuratTugasRes;

      const pegawai = listPegawai.map(({ pegawai: p }) => ({ ...p, pangkat: "" }));

      const docx = generateSuratTugas({
        nomorSurat,
        pegawai,
        textPembuka,
        textPenutup,
        waktuPelaksanaan: 0,
        waktuPerjalanan: 0,
        textTengah,
      });
      const fileRef = storageRef.file(`surat-tugas/${id}.docx`);
      await Packer.toBuffer(docx).then(async (buffer) => {
        await fileRef.save(buffer, { resumable: false });
      });

      await fileRef
        .getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        })
        .then((signedUrls) => {
          // signedUrls[0] contains the file's public URL
          res.status(200).json({
            url: signedUrls[0],
          });
        });

      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
