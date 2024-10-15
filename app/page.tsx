import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { z } from "zod";

const notesResponse = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    content: z.unknown(),
    created_at: z.string(),
    updated_at: z.string(),
  })
);

export default async function Index() {
  const client = createClient();

  const user = await client.auth.getUser();
  if (user.error) {
    return (
      <div>
        <h2>Sign In to Take Notes</h2>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  const notesResult = await client.from("notes").select();

  if (notesResult.error) {
    return <h2>Something went wrong</h2>;
  } else if (!notesResult.data) {
    return <h2>No Notes. Create one?</h2>;
  }

  const notes = notesResponse.safeParse(notesResult.data);
  if (!notes.success) {
    console.error(notes.error);
    return <h2>Something went wrong</h2>;
  }

  return (
    <div className="flex flex-col flex-1 w-full md:max-w-prose max-w-full gap-4">
      <h2 className="text-lg border-b border-b-foreground w-full p-2">
        Your Notes
      </h2>
      {notes.data.map(({ id, title }) => {
        return (
          <Link href={`notes/${id}`} key={id} className="p-2">
            <div>
              <h2>{title}</h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
