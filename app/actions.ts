"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const createNoteAction = async (note: {
  title: string;
  content: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase.from("notes").insert([note]).select();
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
  return data;
};
