import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import ChatClient from "@/components/ChatClient";

export default async function MessagesPage() {
  const user = await requireUser();
  const db = await readDb();
  return <ChatClient user={user} messages={db.messages} />;
}
