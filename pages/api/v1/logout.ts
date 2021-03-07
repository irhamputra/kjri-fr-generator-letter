import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Logout User
   * @method POST
   * @body idToken
   */
  if (req.method === "POST") {
    const { idToken } = req.body;
    const verifyIdToken = await auth.verifyIdToken(idToken, true);
    await auth.revokeRefreshTokens(verifyIdToken.uid);

    res.status(200).json({ message: "Logout berhasil" });
  }
};
