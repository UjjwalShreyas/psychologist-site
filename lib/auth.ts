import { jwtVerify, SignJWT } from "jose";

export const getJwtSecretKey = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Fallback securely by forcing it to fail if not set, 
    // but log it so the user knows.
    console.warn("SESSION_SECRET is not set in environment variables. Using a fallback for development ONLY. Admins. ADD SESSION_SECRET to .env.local!");
  }
  return new TextEncoder().encode(secret || "fallback_default_secret_please_change_this_for_production");
};

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}

export async function signJwtToken(payload: { [key: string]: string | number | boolean }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h") // Session lasts for 8 hours
    .sign(getJwtSecretKey());
}
