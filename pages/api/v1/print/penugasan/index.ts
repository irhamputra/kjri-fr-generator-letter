import { NextApiRequest, NextApiResponse } from "next";
import { db, storage } from "../../../../../utils/firebase";
import { cors } from "../../../../../utils/middlewares";
import { SuratTugasRes } from "../../../../../typings/SuratTugas";
import { PDFDocument } from "pdf-lib";
import { fillKwitansi, fillPernyataan, fillRampungan, fillRincian, fillCover } from "../../../../../utils/pdfLib";
import fs from "fs";
import { JalDis } from "../../../../../typings/Jaldis";
import fontkit from "@pdf-lib/fontkit";
import { Pegawai } from "../../../../../typings/Pegawai";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "POST") {
    try {
      const { suratTugasId, uid, forceRecreate } = req.body;
      console.log(forceRecreate, "FORCE RECREATE");
      const suratTugasRef = db.collection("SuratTugas").doc(suratTugasId as string);
      const snapshot = await suratTugasRef.get();
      const suratTugas = snapshot.data() as SuratTugasRes;
      const { listPegawai = [], pembuatKomitmen, downloadUrl, nomorSurat } = suratTugas;

      // uid = User Unique Id
      const destination = `penugasan/${nomorSurat.replace(/\//g, "_")}_${uid}.pdf`;
      const fileRef = storage.bucket().file(destination);

      // Skip pdf creation if it already has existing pdf
      if (downloadUrl?.suratPenugasan?.[uid] && !forceRecreate) {
        console.log("File available, it will be downloaded...");
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
      const jaldisDoc = jaldis.docs[0];
      const jaldisSnap = jaldisDoc ? (jaldisDoc.data() as JalDis) : undefined;

      const bendahara = (await db
        .collection("Users")
        .doc("A1y9s9WWhkpPoI2H8Tc7")
        .get()) as FirebaseFirestore.DocumentSnapshot<Pegawai>;

      if (rampungan.length > 3) {
        res.status(500).json({ error: "rampungan fill data length must be below 3" });
        return res.end();
      }

      try {
        const chosenListPegawai = listPegawai[iPegawai];
        const pegawai = listPegawai[iPegawai].pegawai;

        const urlOptions = {
          version: "v4" as "v4",
          action: "read" as "read",
          expires: Date.now() + 1000 * 60 * 2, // 2 minutes
        };

        // Get downloadable url using signed url method
        const [url] = await storage.bucket().file("template/SPD_Template_v2.pdf").getSignedUrl(urlOptions);
        const formPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(formPdfBytes);

        // Embed font in pdf
        const fontPath = "fonts/calibri.ttf";
        const [urlFont] = await storage.bucket().file(fontPath).getSignedUrl(urlOptions);
        const font = await fetch(urlFont).then((res) => res.arrayBuffer());
        pdfDoc.registerFontkit(fontkit);
        const calibriFont = await pdfDoc.embedFont(font);

        // Fill form
        let pdfBytes = pdfDoc.getForm();
        pdfBytes = await fillCover(
          pdfBytes,
          { suratTugas, jaldis: jaldisSnap, pegawaiId: uid },
          {
            font: calibriFont,
          }
        );
        pdfBytes = await fillRampungan(
          pdfBytes,
          { pegawai, pembuatKomitmen, rampungan },
          {
            font: calibriFont,
          }
        );
        pdfBytes = await fillRincian(
          pdfBytes,
          { suratTugas, pegawaiId: uid, hargaJaldis: jaldisSnap?.harga, bendahara: bendahara.data() },
          {
            font: calibriFont,
          }
        );
        pdfBytes = await fillPernyataan(
          pdfBytes,
          { pegawai, nomorSuratTugas: nomorSurat, createdAt: suratTugas.createdAt, listPegawai: chosenListPegawai },
          {
            font: calibriFont,
          }
        );
        pdfBytes = await fillKwitansi(
          pdfBytes,
          {
            listPegawai: chosenListPegawai,
            pembuatKomitmen,
            tujuanSurat: suratTugas.tujuanDinas,
            bendahara: bendahara.data(),
            createdAt: suratTugas.createdAt,
          },
          {
            font: calibriFont,
          }
        );

        const mergedPdfFile = await pdfDoc.save();

        // READ ME !
        // This code is for testing document in local, delete later!
        // fs.writeFile(Math.random() + ".pdf", Buffer.from(mergedPdfFile), () => {});

        // Save doc in google storage
        await fileRef.save(mergedPdfFile as Buffer);

        // Update link in database
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
