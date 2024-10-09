"use client";
import { Message } from "@/components/form-message";
import { Button } from "../../../components/ui/button";
import { SVGProps } from "react";
import { createClient } from "../../../utils/supabase/client";

const GoogleLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="currentColor"
      d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301c1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"
    ></path>
  </svg>
);

export default function Login({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();

  const googleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3001/auth/callback",
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-64 gap-4">
      <h2 className="text-lg font-bold">Sign In</h2>
      <Button variant={"outline"} onClick={googleSignIn}>
        <GoogleLogo />
        <span className="">Google</span>
      </Button>
    </div>
  );
}