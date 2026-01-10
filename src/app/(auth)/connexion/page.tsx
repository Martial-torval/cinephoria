"use client";
import LoginForm from "@/components/LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return <LoginForm callbackUrl={callbackUrl} />;
}
