import { useEffect, useState } from "react";
import { onAuthStateChanged } from "../firebase/auth";
// import { createSession, removeSession } from "./cookies";
import { UserCookie } from "@/app/types";
import { User } from "firebase/auth";

export function useUserSession(userCookieSession: UserCookie | null) {
  const [userCookie, setUserCookie] = useState<UserCookie | null>(userCookieSession);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser: User | null) => {
      if (authUser) {
        const userCookieObject = {
          uid: authUser.uid,
          token: await authUser.getIdToken(),
        };

        // await createSession(userCookieObject);
        setUserCookie(userCookieObject);
        // console.log("Usuario autenticado desde useSession:", authUser.uid);
      } else {
        // await removeSession();
        setUserCookie(null);
        // console.log("Usuario no autenticado desde useSession");
      }
    });

    return () => unsubscribe();
  }, []);

  return userCookie;
}
