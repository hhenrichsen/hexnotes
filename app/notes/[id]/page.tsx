import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const noteResponse = z.object({
  id: z.string(),
  title: z.string(),
  content: z.unknown(),
  created_at: z.string(),
  updated_at: z.string(),
});

export default async function ViewNote({ params }: { params: { id: string } }) {
  const client = createClient();

  const user = await client.auth.getUser();
  if (user.error) {
    console.log(user);
    redirect("/sign-in");
  }

  const noteResult = await client
    .from("notes")
    .select()
    .eq("id", params.id)
    .single();
  if (!noteResult || noteResult.error) {
    return <h2>404</h2>;
  }

  const noteParser = noteResponse.safeParse(noteResult.data);
  if (!noteParser.success) {
    console.error(noteParser.error);
    return <h2>Something went wrong</h2>;
  }

  const note = noteParser.data;

  return (
    <div>
      <h1>{note.title}</h1>
      <div>
        <span>Created: {new Date(note.created_at).toLocaleString()}</span>
      </div>
      <p>{JSON.stringify(note.content)}</p>
    </div>
  );
}
