import { NextApiRequest, NextApiResponse } from "next";
import authInstance from "../../../utils/firebase/authInstance";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Forget Password User
   * @method POST
   * @body idToken
   */
  if (req.method === "POST") {
    try {
      const { email } = req.body;
      const { data } = await authInstance.post("/accounts:sendOobCode", {
        requestType: "PASSWORD_RESET",
        email,
      });
      res.status(200).json({
        message: `Link untuk reset password sudah dikirim ke alamat ${data.email}`,
      });
      res.end();
    } catch (e) {
      res.status(400).json({ message: "Tidak ada akun yang terkirim" });
      res.end();
    }
  }
};
