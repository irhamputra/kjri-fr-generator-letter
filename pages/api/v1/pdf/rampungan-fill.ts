import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { RampunganFillReqBody } from "../../../../typings/RampunganFill";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";
const fs = require("fs");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      const { rampungan, pembuatKomitmenName, pembuatKomitmenNIP } = <RampunganFillReqBody>req.body;
      const formUrl = "http://localhost:3000/docs/Rampungan%20Fill.pdf";
      const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

      if (rampungan.length > 3) res.status(500).json({ error: "data length must be below 3" });

      //  tujuan_1_rampungan
      const pdfDoc = await PDFDocument.load(formPdfBytes);

      const form = pdfDoc.getForm();

      const namaPembuatKomitmen = form.getTextField("nama_pejabat_komitmen_rincian");
      const nip1 = form.getTextField("NIP_1_rincian");

      namaPembuatKomitmen.setText(pembuatKomitmenName);
      nip1.setText(pembuatKomitmenNIP);

      const tujuan1 = form.getTextField("tujuan_1_rampungan");
      const tanggalTujuan1 = form.getTextField("tanggal_1_rincian");
      const kedatangan1 = form.getTextField("kedatangan_1_rincian");
      const tanggalKedatangan1 = form.getTextField("tanggal_2_rincian");

      if (rampungan[0]) {
        tujuan1.setText(rampungan[0].pergiDari);
        tanggalTujuan1.setText(rampungan[0].tanggalPergi);
        kedatangan1.setText(rampungan[0].tibaDi);
        tanggalKedatangan1.setText(rampungan[0].tanggalTiba);
      }

      const berangkat1 = form.getTextField("berangkat_1_rincian");
      const tujuan2 = form.getTextField("tujuan_2_rincian");
      const tanggalTujuan2 = form.getTextField("tanggal_2_rincian");
      const kedatangan2 = form.getTextField("kedatangan_2_rincian");
      const tanggalKedatangan2 = form.getTextField("tanggal_3_rincian");

      if (rampungan[1]) {
        berangkat1.setText(rampungan[0].tibaDi);
        tujuan2.setText(rampungan[1].pergiDari);
        tanggalTujuan2.setText(rampungan[1].tanggalPergi);
        kedatangan2.setText(rampungan[1].tibaDi);
        tanggalKedatangan2.setText(rampungan[1].tanggalTiba);
      }

      const berangkat2 = form.getTextField("berangkat_2_rincian");
      const tujuan3 = form.getTextField("tujuan_3_rincian");
      const tanggalTujuan3 = form.getTextField("tanggal_4_rincian");
      const kedatangan3 = form.getTextField("kedatangan_3_rincian");
      const tanggalKedatangan3 = form.getTextField("tanggal_5_rincian");

      if (rampungan[2]) {
        berangkat2.setText(rampungan[1].tibaDi);
        tujuan3.setText(rampungan[2].pergiDari);
        tanggalTujuan3.setText(rampungan[2].tanggalPergi);
        kedatangan3.setText(rampungan[2].tibaDi);
        tanggalKedatangan3.setText(rampungan[2].tanggalTiba);
      }

      const pdfBytes = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=some_file.pdf");
      res.setHeader("Content-Length", pdfBytes.length);

      res.status(200).send(pdfBytes);
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "PUT") {
    const { nomorSurat, listPegawai } = req.body;

    if (listPegawai.length <= 0) {
      res.status(404).json({ error: "Tidak ada data yang tersimpan" });
      res.end();
    }

    try {
      let id = "";

      const snapshot = await db.collection("SuratTugas").where("nomorSurat", "==", nomorSurat).limit(1).get();

      snapshot.forEach((doc) => {
        id = doc.id;
      });

      await db.collection("SuratTugas").doc(id).update({
        listPegawai,
      });

      res.status(200).json({ message: "Update Surat Tugas" });
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
