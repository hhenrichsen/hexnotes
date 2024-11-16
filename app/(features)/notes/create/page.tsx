"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNoteAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { XIcon } from "lucide-react";

const createNoteSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string(),
});

export default function CreateNote() {
  const router = useRouter();
  const form = useForm<z.infer<typeof createNoteSchema>>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  async function onSubmit({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) {
    const noteResponse = await createNoteAction({ title, content });
    if (noteResponse.ok) {
      router.push(`/notes/${noteResponse.id}`);
    } else {
      setError(noteResponse.reason);
      console.error(noteResponse.reason);
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full md:max-w-prose max-w-full gap-4">
      {!!error ? (
        <Alert variant={"destructive"}>
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Failed to Create Note</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <XIcon className="h-4 w-4" onClick={() => setError(null)} />
        </Alert>
      ) : null}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="title-label">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A Note"
                    {...field}
                    data-testid="title-input"
                  />
                </FormControl>
                <FormMessage data-testid="title-message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="content-label">Content</FormLabel>
                <FormControl>
                  <Textarea
                    data-testid="content-input"
                    placeholder="Something thoughtful, hopefully."
                    {...field}
                  />
                </FormControl>
                <FormMessage data-testid="content-message" />
              </FormItem>
            )}
          />
          <Button type="submit" data-testid="submit-button">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
