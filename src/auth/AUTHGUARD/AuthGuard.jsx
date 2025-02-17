import { useSelf } from "@/store/self.store";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const AuthGuard = ({ children }) => {
  const router = useRouter();
  const { self } = useSelf();

  useEffect(() => {
    if (!self) {
      router.push("/login");
    }
  }, [self, router]);

  if (!self) {
    return null;
  }

  return <>{children}</>;
};
