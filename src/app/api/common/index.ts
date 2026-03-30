import crypto from "crypto";

export async function GenerateToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}
