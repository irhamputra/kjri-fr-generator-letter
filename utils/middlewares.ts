import Cors from "cors";
import multer from "multer";

export default function middlewares(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export const cors = middlewares(Cors());
export const upload = middlewares(multer());
