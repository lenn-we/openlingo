import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { DEFAULT_PATH } from "@/lib/constants";

export default async function LandingPage() {
  const session = await getSession();
  redirect(session ? DEFAULT_PATH : "/sign-in");
}
