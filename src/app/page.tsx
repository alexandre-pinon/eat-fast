import { SignIn } from "@/components/sign-in";

export default function Home() {
  return (
    <main className="">
      <h1 className="text-4xl font-semibold">EatFast</h1>
      <div className="flex gap-x-2">
        <SignIn variant="flat" color="primary" provider="google" />
        <SignIn variant="ghost" color="primary" provider="resend" />
      </div>
    </main>
  );
}
