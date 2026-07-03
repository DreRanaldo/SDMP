import { requireUser } from "@/lib/auth";
import PostProjectClient from "@/components/PostProjectClient";

export default async function PostProjectPage() {
  const user = await requireUser();
  return <PostProjectClient user={user} />;
}
