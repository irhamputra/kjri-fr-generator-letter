import { NextApiRequest, NextApiResponse } from "next";
import authInstance from "../../../utils/firebase/authInstance";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

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
