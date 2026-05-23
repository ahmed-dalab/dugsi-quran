import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import { connectDB } from "../src/config/database";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB({ exitOnFailure: false });
  return app(req, res);
}
