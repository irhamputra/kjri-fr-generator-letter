import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { RampunganFillReqBody } from "../../../../typings/RampunganFill";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      const { rampungan, pembuatKomitmenName, pembuatKomitmenNIP } = <RampunganFillReqBody>req.body;
      const formUrl =
        "https://firebasestorage.googleapis.com/v0/b/kjri-fr-dev.appspot.com/o/template%2FRampungan%20Fill.pdf?alt=media&token=cbb0764d-2e42-449e-bcfc-c003fee8832a";
      const { data } = await axios.get(formUrl, { responseType: "arraybuffer" }); // fetch(formUrl).then((res) => res.arrayBuffer());

      if (rampungan.length > 3) res.status(500).json({ error: "data length must be below 3" });

      const pdfDoc = await PDFDocument.load(data);

      const form = pdfDoc.getForm();

      const namaPembuatKomitmen = form.getTextField("nama_pejabat_komitmen_rincian");
      const nip1 = form.getTextField("NIP_1_rincian");

      namaPembuatKomitmen.setText(pembuatKomitmenName);
      nip1.setText(pembuatKomitmenNIP);

      namaPembuatKomitmen.enableReadOnly();
      nip1.enableReadOnly();

      const tujuan1 = form.getTextField("tujuan_1_rampungan");
      const tanggalTujuan1 = form.getTextField("tanggal_1_rincian");
      const kedatangan1 = form.getTextField("kedatangan_1_rincian");
      const tanggalKedatangan1 = form.getTextField("tanggal_2_rincian");

      if (rampungan[0]) {
        tujuan1.setText(rampungan[0].pergiDari);
        tanggalTujuan1.setText(rampungan[0].tanggalPergi);
        kedatangan1.setText(rampungan[0].tibaDi);
        tanggalKedatangan1.setText(rampungan[0].tanggalTiba);

        // readonly
        tujuan1.enableReadOnly();
        tanggalTujuan1.enableReadOnly();
        kedatangan1.enableReadOnly();
        kedatangan1.enableReadOnly();
        tanggalKedatangan1.enableReadOnly();
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

        // readonly
        berangkat1.enableReadOnly();
        tujuan2.enableReadOnly();
        tanggalTujuan2.enableReadOnly();
        kedatangan2.enableReadOnly();
        tanggalKedatangan2.enableReadOnly();
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

        // readonly
        berangkat2.enableReadOnly();
        tujuan3.enableReadOnly();
        tanggalTujuan3.enableReadOnly();
        kedatangan3.enableReadOnly();
        tanggalKedatangan3.enableReadOnly();
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
