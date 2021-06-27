import { NextApiRequest, NextApiResponse } from "next";
import { db, storage } from "../../../../../utils/firebase";
import { cors } from "../../../../../utils/middlewares";
import { SuratTugasRes } from "../../../../../typings/SuratTugas";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import dayjs from "dayjs";

const formattedDayjs = (date: Date) => dayjs(date).format("DD.MM.YYYY");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      const { suratTugasId, email } = req.body;

      const storageRef = storage.bucket();
      const fileRef = storageRef.file(`penugasan/${suratTugasId}.pdf`);
      const suratTugasRef = db.collection("SuratTugas").doc(suratTugasId as string);
      const snapshot = await suratTugasRef.get();

      const { listPegawai = [], pembuatKomitmen, downloadUrl } = snapshot.data() as SuratTugasRes;

      if (downloadUrl?.suratPenugasan) {
        res.status(201).json({
          message: "Document telah dibuat",
          url: downloadUrl.suratPenugasan,
        });
        res.end();
        return;
      }

      // Create Document
      const formUrl = "http://localhost:3000/docs/Rampungan%20Fill.pdf";
      const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

      const iPegawai = listPegawai.findIndex(({ pegawai }) => pegawai.email === email);
      const rampungan = listPegawai[iPegawai].destinasi ?? [];

      if (rampungan.length > 3) {
        res.status(500).json({ error: "data length must be below 3" });
        return res.end();
      }

      //  tujuan_1_rampungan
      const pdfDoc = await PDFDocument.load(formPdfBytes);

      const form = pdfDoc.getForm();

      const namaPembuatKomitmen = form.getTextField("nama_pejabat_komitmen_rincian");
      const nip1 = form.getTextField("NIP_1_rincian");

      namaPembuatKomitmen.setText(pembuatKomitmen?.name);
      nip1.setText(pembuatKomitmen?.nip);

      const tujuan1 = form.getTextField("tujuan_1_rampungan");
      const tanggalTujuan1 = form.getTextField("tanggal_1_rincian");
      const kedatangan1 = form.getTextField("kedatangan_1_rincian");
      const tanggalKedatangan1 = form.getTextField("tanggal_2_rincian");

      if (rampungan[0]) {
        tujuan1.setText(rampungan[0].tibaDi);
        tanggalTujuan1.setText(formattedDayjs(rampungan[0].tanggalPergi));
        kedatangan1.setText(rampungan[0].tibaDi);
        tanggalKedatangan1.setText(formattedDayjs(rampungan[0].tanggalTiba));
      }

      const berangkat1 = form.getTextField("berangkat_1_rincian");
      const tujuan2 = form.getTextField("tujuan_2_rincian");
      const tanggalTujuan2 = form.getTextField("tanggal_2_rincian");
      const kedatangan2 = form.getTextField("kedatangan_2_rincian");
      const tanggalKedatangan2 = form.getTextField("tanggal_3_rincian");

      if (rampungan[1]) {
        berangkat1.setText(rampungan[1].pergiDari);
        tujuan2.setText(rampungan[1].tibaDi);
        tanggalTujuan2.setText(formattedDayjs(rampungan[1].tanggalPergi));
        kedatangan2.setText(rampungan[1].tibaDi);
        tanggalKedatangan2.setText(formattedDayjs(rampungan[1].tanggalTiba));
      }

      const berangkat2 = form.getTextField("berangkat_2_rincian");
      const tujuan3 = form.getTextField("tujuan_3_rincian");
      const tanggalTujuan3 = form.getTextField("tanggal_4_rincian");
      const kedatangan3 = form.getTextField("kedatangan_3_rincian");
      const tanggalKedatangan3 = form.getTextField("tanggal_5_rincian");

      if (rampungan[2]) {
        berangkat2.setText(rampungan[2].pergiDari);
        tujuan3.setText(rampungan[2].tibaDi);
        tanggalTujuan3.setText(formattedDayjs(rampungan[2].tanggalPergi));
        kedatangan3.setText(rampungan[2].tibaDi);
        tanggalKedatangan3.setText(formattedDayjs(rampungan[2].tanggalTiba));
      }

      tujuan1.enableReadOnly();
      tanggalTujuan1.enableReadOnly();
      kedatangan1.enableReadOnly();
      tanggalKedatangan1.enableReadOnly();

      berangkat1.enableReadOnly();
      tujuan2.enableReadOnly();
      tanggalTujuan2.enableReadOnly();
      kedatangan2.enableReadOnly();
      tanggalKedatangan2.enableReadOnly();

      berangkat2.enableReadOnly();
      tujuan3.enableReadOnly();
      tanggalTujuan3.enableReadOnly();
      kedatangan3.enableReadOnly();
      tanggalKedatangan3.enableReadOnly();

      namaPembuatKomitmen.enableReadOnly();
      nip1.enableReadOnly();

      const pdfBytes = await pdfDoc.save();
      await fileRef.save(pdfBytes as Buffer);

      const signedUrls = await fileRef.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      await suratTugasRef.update({
        downloadUrl: {
          ...downloadUrl,
          suratPenugasan: signedUrls[0],
        },
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${suratTugasId}.pdf`);
      res.setHeader("Content-Length", pdfBytes.length);

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
