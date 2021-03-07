import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * GET User
   */
  if (req.method === "GET") {
    return res.status(200).json({
      data: "hello login route",
    });
  }
};
