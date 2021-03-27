import { NextApiRequest, NextApiResponse } from "next";
import authInstance from "../../../../utils/firebase/authInstance";
import { cors } from "../../../../utils/middlewares";
import tokenInstance from "../../../../utils/firebase/tokenInstance";
import qs from "qs";
import { db } from "../../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    const token = req.headers.authorization.replace("Bearer ", "");

    const adminRole = ["admin", "tu"];

    const { data } = await authInstance.post("/accounts:lookup", {
      idToken: token,
    });

    const [user] = data.users;

    const snapshot = await db
      .collection("Users")
      .limit(1)
      .where("email", "==", user.email)
      .get();
    const dataSnapshot = snapshot.docs[0].data();

    res
      .status(200)
      .json({
        isAdmin: adminRole.includes(dataSnapshot.role),
        ...dataSnapshot,
      });
    res.end();
  }

  if (req.method === "POST") {
    try {
      const body = qs.stringify({
        grant_type: "refresh_token",
        refresh_token: req.body.refreshToken,
      });

      const { data } = await tokenInstance.post("/token", body);

      res.status(200).json(data);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
