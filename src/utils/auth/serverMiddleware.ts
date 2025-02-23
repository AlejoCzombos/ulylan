import admin from "@/utils/firebase/server";
import { userHasRole as userHasAnyRole } from "./serverUtils";
import { NextRequest } from "next/server";

export const tryValidateFirebaseIdToken = async (request: NextRequest) => {
  const cookies = request.cookies.get("firebase-auth-cookie");
  const bearerToken = request.headers.get("authorization");

  if (!cookies) {
    console.warn("No authentication cookie found");
    return null;
  }

  const userCookie = JSON.parse(cookies.value);
  const userUid = userCookie.uid;

  if (!bearerToken) {
    console.warn("No bearer token found in headers");
    return null;
  }

  const token = formatToken(bearerToken);

  if (!token) {
    console.warn("No token found in cookie");
    return null;
  }

  try {
    const decodedToken = await decodedIdToken(token);

    if (decodedToken.uid !== userUid) {
      console.warn("Token does not match user");
      return null;
    }

    return decodedToken;
  } catch (error) {
    console.error("Token validation failed:", error);
    return null;
  }
};

export function formatToken(token: string) {
  if (!token || token === "" || !token.startsWith("Bearer ")) {
    console.error("No token found");
    return null;
  }
  token = token.split("Bearer ")[1];
  return token;
}

export const decodedIdToken = async (idToken: string) => {
  try {
    const auth = admin.auth();
    const decodedIdToken = await auth.verifyIdToken(idToken);
    return decodedIdToken;
  } catch (error) {
    console.error("Error verifying token", error);
    throw new Error("Error verifying token");
  }
};

export const validateUserHasAnyRole = async (request: NextRequest, roles: string[]) => {
  const decodeToken = await tryValidateFirebaseIdToken(request);
  if (!decodeToken) {
    return false;
  }

  if (!(await userHasAnyRole(decodeToken.uid, roles))) {
    return false;
  }
  return true;
};
