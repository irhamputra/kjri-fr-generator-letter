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
      const { id, forceRecreate } = req.body;
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
        createdAt,
        konjen,
      } = snapshot.data() as SuratTugasRes & { konjen: string };

      if (downloadUrl?.suratTugas && !forceRecreate) {
        const fileRef = storageRef.file(downloadUrl?.suratTugas);
        const signedUrls = await fileRef.getSignedUrl({
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes,
        });

        res.status(200).json({
          message: "Surat akan didownload...",
          url: signedUrls[0],
        });
        res.end();

        return;
      }

      const destination = `surat-tugas/${nomorSurat.replace(/\//g, "_")}.docx`;
      const fileRef = storageRef.file(destination);

      const pegawai = listPegawai.map(({ pegawai: p }) => p);
      const day = listPegawai.map(({ durasi }) => durasi);

      const maxDay = day.sort()[day.length - 1];
      const docx = await generateSuratTugas({
        nomorSurat,
        pegawai,
        textPembuka,
        textPenutup,
        waktuPelaksanaan: maxDay,
        waktuPerjalanan: maxDay,
        textTengah,
        createdAt,
        konjen,
      });

      await Packer.toBuffer(docx).then(async (buffer) => {
        await fileRef.save(buffer, { resumable: false });
      });

      await suratTugasRef.update({
        downloadUrl: {
          ...downloadUrl,
          suratTugas: destination,
        },
      });

      const signedUrls = await fileRef.getSignedUrl({
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes,
      });

      res.status(200).json({
        message: "Sukses membuat surat",
        url: signedUrls[0],
      });

      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
