import { Request as ExpressRequest } from "express";
import { TokenPayload } from "./TokenPayload";
import { AdminTokenPayload } from "./AdminTokenPayload";

export interface Request extends ExpressRequest {
  user?: TokenPayload;
  admin?: AdminTokenPayload;
}
