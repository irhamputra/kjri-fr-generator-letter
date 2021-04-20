import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument } from "pdf-lib";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const snapshot = await db
        .collection("SuratTugas")
        .doc(id as string)
        .get();

      const data = snapshot.data();

      // load template from Storage
      const pdfBytes: ArrayBuffer = await axios.get(
        "https://firebasestorage.googleapis.com/v0/b/kjri-fr-dev.appspot.com/o/test-surat%2Ftemplate.pdf?alt=media",
        {
          responseType: "arraybuffer",
        }
      );

      const pdfDoc = await PDFDocument.load(pdfBytes);

      const form = pdfDoc.getForm();

      const field = form.getTextField("nama_pegawai");
      // TODO: set data from collection to pdf here
      field.setText("");

      res.status(200).json({});
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
