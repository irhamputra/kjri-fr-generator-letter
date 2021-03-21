import { NextApiRequest, NextApiResponse } from "next";
import authInstance from "../../../utils/firebase/authInstance";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const token = req.headers.authorization.replace("Bearer ", "");

    const { data } = await authInstance.post("/accounts:lookup", {
      idToken: token,
    });

    const [user] = data.users;

    res.status(200).json({ email: user.email });
    res.end();
  }
};
