import { redirect } from "next/navigation";

export default function SignInRedirect() {
  redirect("/auth/sign-in");
}