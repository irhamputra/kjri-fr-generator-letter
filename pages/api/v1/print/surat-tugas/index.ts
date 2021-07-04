import { NextApiRequest, NextApiResponse } from "next";
import { db, storage } from "../../../../../utils/firebase";
import { cors } from "../../../../../utils/middlewares";
import { generateSuratTugas } from "../../../../../utils/docx";
import { SuratTugasRes } from "../../../../../typings/SuratTugas";
import { Packer } from "docx";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      const { id } = req.body;
      const storageRef = storage.bucket();
      const suratTugasRef = db.collection("SuratTugas").doc(id as string);
      const snapshot = await suratTugasRef.get();

      const {
        nomorSurat,
        listPegawai = [],
        textTengah = [],
        textPembuka = [],
        textPenutup = [],
        downloadUrl,
      } = snapshot.data() as SuratTugasRes;

      if (downloadUrl?.suratTugas) {
        res.status(201).json({
          message: "Document telah dibuat",
          url: downloadUrl.suratTugas,
        });
        res.end();
        return;
      }

      const pegawai = listPegawai.map(({ pegawai: p }) => p);
      const day = listPegawai.map(({ durasi }) => durasi);

      const maxDay = day.sort()[day.length - 1];
      const docx = generateSuratTugas({
        nomorSurat,
        pegawai,
        textPembuka,
        textPenutup,
        waktuPelaksanaan: maxDay,
        waktuPerjalanan: maxDay,
        textTengah,
      });

      const fileRef = storageRef.file(`surat-tugas/${id}.docx`);

      await Packer.toBuffer(docx).then(async (buffer) => {
        await fileRef.save(buffer, { resumable: false });
      });

      const signedUrls = await fileRef.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      await suratTugasRef.update({
        downloadUrl: {
          ...downloadUrl,
          suratTugas: signedUrls[0],
        },
      });

      res.status(200).json({
        url: signedUrls[0],
      });

      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
