import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

export default function middlewares(middleware: Function) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export const cors = middlewares(Cors());
