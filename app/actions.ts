"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

const createNoteSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string(),
});

export const createNoteAction = async (note: {
  title: string;
  content: string;
}): Promise<
  | { ok: false; reason: string }
  | { ok: true; id: string; title?: string; content?: string }
> => {
  const supabase = createClient();
  const auth = await supabase.auth.getUser();
  if (auth.error) {
    return redirect("/sign-in");
  }

  const checkNote = createNoteSchema.safeParse(note);
  if (!checkNote.success) {
    return { ok: false, reason: "Invalid note" };
  }

  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        title: checkNote.data.title,
        content: checkNote.data.content,
        user_id: auth.data.user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return { ok: false, reason: "Failed to create note" };
  }

  const { id, title, content } = data;
  if (!id) {
    return { ok: false, reason: "Failed to parse note" };
  }

  return { ok: true, id, title, content };
};
