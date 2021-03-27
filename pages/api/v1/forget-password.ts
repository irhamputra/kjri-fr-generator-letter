import { NextApiRequest, NextApiResponse } from "next";
import authInstance from "../../../utils/firebase/authInstance";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Forget Password User
   * @method POST
   * @body idToken
   */
  await cors(req, res);
  const { email } = req.body;

  if (req.method === "POST") {
    try {
      await authInstance.post("/accounts:sendOobCode", {
        requestType: "PASSWORD_RESET",
        email,
      });
      res.status(200).json({
        message: "Link reset password berhasil terkirim",
      });
      res.end();
    } catch (e) {
      res.status(404).json({ messaage: `Email ${email} tidak ditemukan` });
      res.end();
    }
  }
};
