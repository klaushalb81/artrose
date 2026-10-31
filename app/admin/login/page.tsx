import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div style={{ maxWidth: 420, margin: "48px auto" }}>
      <h1 className="display-sm" style={{ marginBottom: 24 }}>
        Logg inn
      </h1>
      <LoginForm />
    </div>
  );
}
