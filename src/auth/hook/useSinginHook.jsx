import { useState } from "react";
import { setCookie } from "cookies-next";
import axios from "axios";
import { API_URL, END_POINTS } from "@/lib/api-client/constant"; // Changed to constant.js instead of constantAdmin.js

export function useSignIn() {
  const [isPending, setIsPending] = useState(false);

  const signIn = async (credentials) => {
    setIsPending(true);
    try {
      const response = await axios.post(
        `${API_URL}${END_POINTS.signIn.path}`, // Using the correct endpoint from constant.js
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && response.data.result) {
        const { token, role } = response.data.result;

        // Store token and role cookies
        setCookie("token", token, {
          maxAge: 60 * 60 * 24,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        setCookie("userRole", role, {
          maxAge: 60 * 60 * 24,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return {
          success: true,
          role: role,
          token: token,
        };
      }

      return { success: false };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { signIn, isPending };
}
