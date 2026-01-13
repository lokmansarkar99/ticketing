import jwt, { Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import config from "../config";

type KeyType = "ACCESS" | "REFRESH" | "OTP";

const toExpiresIn = (value: unknown, fallback: StringValue): StringValue => {
  // env values are strings; cast to the ms StringValue union for typings
  return (value as StringValue) || fallback;
};

const toSecret = (value: unknown, name: string): Secret => {
  if (!value) throw new Error(`${name} is missing`);
  return value as Secret;
};

export const createToken = (payload: any, keyType: KeyType): string => {
  const options = (expiresIn: StringValue): SignOptions => ({ expiresIn });

  if (keyType === "ACCESS") {
    return jwt.sign(
      payload,
      toSecret(config.auth_token, "AUTH_TOKEN"),
      options(toExpiresIn(config.auth_token_expires_in, "15d"))
    );
  }

  if (keyType === "REFRESH") {
    return jwt.sign(
      payload,
      toSecret(config.refresh_token, "REFRESH_TOKEN"),
      options(toExpiresIn(config.refresh_token_expires_in, "30d"))
    );
  }

  // OTP
  return jwt.sign(
    payload,
    toSecret(config.otp_token, "OTP_TOKEN"),
    options(toExpiresIn(config.otp_token_expires_in, "2m"))
  );
};
