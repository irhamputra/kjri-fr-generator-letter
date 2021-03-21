import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../utils/firebase";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Logout User
   * @method POST
   * @body idToken
   */
  await cors(req, res);

  if (req.method === "POST") {
    try {
      const { idToken } = req.body;
      const verifyIdToken = await auth.verifyIdToken(idToken, true);
      await auth.revokeRefreshTokens(verifyIdToken.uid);

      await verifyIdToken;

      res.status(200).json({ message: "Logout berhasil" });
      res.end();
    } catch (e) {
      res.status(400).json({ message: "Tidak ada akun yang terautentikasi" });
      res.end();
    }
  }
};
