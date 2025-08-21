import { Buffer } from "node:buffer";
import crypto from "node:crypto";

export function encryptPassword(message: string): string {
  const key = "lzYW5qaXVqa";
  const salt = crypto.randomBytes(8);

  function md5(data: crypto.BinaryLike): Buffer {
    return crypto.createHash("md5").update(data).digest();
  }

  const hash1 = md5(Buffer.concat([Buffer.from(key), salt]));
  const hash2 = md5(Buffer.concat([hash1, Buffer.from(key), salt]));
  const hash3 = md5(Buffer.concat([hash2, Buffer.from(key), salt]));

  const calKey = Buffer.concat([hash1, hash2]).subarray(0, 32);
  const iv = hash3.subarray(0, 16);

  const cipher = crypto.createCipheriv("AES-256-CBC", calKey, iv);
  const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);

  const saltedCipherText = Buffer.concat([
    Buffer.from("Salted__"),
    salt,
    encrypted,
  ]);

  return saltedCipherText.toString("base64");
}
