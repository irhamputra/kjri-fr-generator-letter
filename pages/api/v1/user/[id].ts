import { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../../../../utils/middlewares";
import { auth, db } from "../../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const snapshot = await db
        .collection("Users")
        .doc(id as string)
        .get();

      const dataSnapshot = snapshot.data();

      res.status(200).json({ ...dataSnapshot });
      res.end();
    } catch (e) {
      res.end();
    }
  }

  if (req.method === "PUT") {
    const { displayName, email, nip, golongan, jabatan, role, pangkat } = req.body;

    const { id } = req.query;

    await db
      .collection("Users")
      .doc(id as string)
      .update({
        displayName,
        email,
        nip,
        golongan,
        jabatan,
        role,
        pangkat
      });

    res.status(200).json({ message: "Update Profile", data: { displayName, email, nip, golongan, jabatan, role } });
    res.end();
  }

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
