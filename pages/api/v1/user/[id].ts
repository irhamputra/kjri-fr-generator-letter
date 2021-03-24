import { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../../../../utils/middlewares";
import { auth, db } from "../../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await db
        .collection("Users")
        .doc(id as string)
        .delete();
      await auth.deleteUser(id as string);

      res.status(200).json({ message: "User berhasil dihapus" });
      res.end();
    } catch (e) {
      res.end();
    }
  }
};
