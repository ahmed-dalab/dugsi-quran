import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";
import { UserRole } from "../modules/users/user.model.js";


interface JwtUserPayload {
  _id: string;
  role: UserRole;
}
export function signAccessToken(user: JwtUserPayload) {
    const payload ={
        sub: user._id.toString(),
        role: user.role,
    }
     const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    options
  );
}

export function signRefreshToken(user: { _id: string }) {
    const payload = {
        sub: user._id.toString(),
        type: "refresh",
        jti: crypto.randomUUID(),
    }
    const options: SignOptions = {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    }
  return jwt.sign(
   payload,
    env.JWT_REFRESH_SECRET,
    options
  );
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}