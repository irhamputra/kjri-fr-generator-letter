import { NextApiRequest, NextApiResponse } from "next";
import { db, storage } from "../../../../../utils/firebase";
import { cors } from "../../../../../utils/middlewares";
import { SuratTugasRes } from "../../../../../typings/SuratTugas";
import { PDFDocument } from "pdf-lib";
import {
  createKwitansiFill,
  createPernyataanFill,
  createRampunganFill,
  createRincianFill,
} from "../../../../../utils/pdfLib";
import fs from "fs";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      const { suratTugasId, uid, forceRecreate } = req.body;

      const destination = `penugasan/${suratTugasId}-${uid}.pdf`;
      const fileRef = storage.bucket().file(destination);
      const suratTugasRef = db.collection("SuratTugas").doc(suratTugasId as string);
      const snapshot = await suratTugasRef.get();

      const suratTugas = snapshot.data() as SuratTugasRes;
      const { listPegawai = [], pembuatKomitmen, downloadUrl, nomorSurat } = suratTugas;

      if (downloadUrl?.suratPenugasan?.[uid] && !forceRecreate) {
        const signedUrls = await fileRef.getSignedUrl({
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes,
        });

        res.status(201).json({
          message: "Surat akan didownload...",
          url: signedUrls[0],
        });
        res.end();
        return;
      }

      const iPegawai = listPegawai.findIndex(({ pegawai }) => pegawai.uid === uid);
      const rampungan = listPegawai[iPegawai].destinasi ?? [];
      const jaldis = await db
        .collection("JalDis")
        .limit(1)
        .where("golongan", "==", listPegawai[iPegawai].pegawai.golongan)
        .get();
      const jaldisSnap = jaldis.docs[0].data();

      if (rampungan.length > 3) {
        res.status(500).json({ error: "data length must be below 3" });
        return res.end();
      }

      try {
        const mergedPdf = await PDFDocument.create();

        const pdfBytes = await createRampunganFill(pembuatKomitmen, rampungan);
        const rincianPdf = await createRincianFill(suratTugas, uid, jaldisSnap?.harga);
        const pernyataanFill = await createPernyataanFill(listPegawai[iPegawai].pegawai, nomorSurat);
        const kwitansiPdf = await createKwitansiFill(pembuatKomitmen);

        const copyA = await PDFDocument.load(pdfBytes);
        const copyB = await PDFDocument.load(rincianPdf);
        const copyC = await PDFDocument.load(pernyataanFill);
        const copyD = await PDFDocument.load(kwitansiPdf);

        const copiedPagesA = await mergedPdf.copyPages(copyA, copyA.getPageIndices());
        copiedPagesA.forEach((page) => mergedPdf.addPage(page));

        const copiedPagesB = await mergedPdf.copyPages(copyB, copyB.getPageIndices());
        copiedPagesB.forEach((page) => mergedPdf.addPage(page));

        const copiedPagesC = await mergedPdf.copyPages(copyC, copyC.getPageIndices());
        copiedPagesC.forEach((page) => mergedPdf.addPage(page));

        const copiedPagesD = await mergedPdf.copyPages(copyD, copyD.getPageIndices());
        copiedPagesD.forEach((page) => mergedPdf.addPage(page));

        const mergedPdfFile = await mergedPdf.save();

        fs.writeFile(Math.random() + ".pdf", Buffer.from(mergedPdfFile), () => {});

        await fileRef.save(mergedPdfFile as Buffer);

        await suratTugasRef.update({
          downloadUrl: {
            ...downloadUrl,
            suratPenugasan: { ...downloadUrl?.suratPenugasan, [uid]: destination },
          },
        });
      } catch (e) {
        console.error(e);
      }

      const signedUrls = await fileRef.getSignedUrl({
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes,
      });

      res.status(201).json({
        message: "Document berhasil dibuat",
        url: signedUrls[0],
      });

      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
