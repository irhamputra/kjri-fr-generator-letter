import cookie from "cookie";
import { IncomingMessage } from "http";

type ParsedCookie = { [p: string]: string };

const parseCookies = (req: IncomingMessage): ParsedCookie => {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
};

export default parseCookies;
