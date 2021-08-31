import { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../../../utils/middlewares";
import { db } from "../../../utils/firebase";
import { v4 } from "uuid";
import nodemailer from "nodemailer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const result: FirebaseFirestore.DocumentData = [];
      const snapshot = await db.collection("Users").where("role", "==", "default").get();

      snapshot.forEach((doc) => {
        result.push(doc.data());
      });

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "POST") {
    const { email } = req.body;
    const uuid = v4();
    const codeId = uuid.slice(-5);

    const isAvailable = await db.collection("Users").where("email", "==", email).limit(1).get();

    if (!isAvailable.empty) {
      return res.status(404).json({ message: "Email ini telah terdaftar" });
    } else {
      const transport = nodemailer.createTransport({
        service: "SendinBlue",
        auth: {
          user: process.env.SENDINBLUE_USER,
          pass: process.env.SENDINBLUE_PASS,
        },
      });

      try {
        await db.collection("Users").doc(uuid).set({ email, codeId, uuid });

        await transport.sendMail({
          from: "noreply@kjri-frankfurt.de",
          to: email,
          subject: "Kode Verifikasi Registrasi",
          html: `<body> 
                <h1>Selamat datang di aplikasi KJRI Frankfurt</h1>
                <hr/>
                <p>Kode verifikasi akun anda:</p>
                <h2>${codeId}</h2>
                <p>dan klik button dibawah ini untuk melanjutkan verifikasi
                <br/>
                <a href="https://sistem-nomor-surat-kjri-frankfurt.vercel.app/register">
                   <button style="color: #444444;
                                  background: #F3F3F3;
                                  border: 1px #DADADA solid;
                                  padding: 5px 10px;
                                  border-radius: 2px;
                                  font-weight: bold;
                                  font-size: 9pt;
                                  outline: none;
                                  cursor: pointer"
                   >
                    Verifikasi Akun Anda
                   </button>
                </a><br/>
                untuk mendaftarkan akun anda</p>
                <p>Jika terjadi kesalahan silahkan hubungi Admin KJRI Frankfurt</p><br/><br/><p>Salam hangat dari Admin KJRI Frankfurt</p></body>`,
        });
      } catch (e) {
        res.status(500).end(e);
        return res.end();
      }

      res.status(200).json({ message: "Kode verifikasi telah terkirim" });
      return res.end();
    }
  }
};
