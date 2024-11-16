import { stripeClient } from "@/utils/stripe/stripe";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { z } from "zod";

const BodyValidator = z.object({
  id: z.string(),
  priceId: z.string(),
});

export async function POST(req: NextRequest) {
  const body = Object.fromEntries((await req.formData()).entries());
  const bodyResult = BodyValidator.safeParse(body);
  const user = await createClient().auth.getUser();

  if (user.error) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`);
  }

  if (!bodyResult.success) {
    return Response.json({ error: bodyResult.error }, { status: 400 });
  }

  const price = await stripeClient.prices.retrieve(bodyResult.data.priceId);

  const session = await stripeClient.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    customer_email: user.data.user.email,
    mode: price.recurring ? "subscription" : "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
  });

  if (!session || !session.url) {
    return Response.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }

  return Response.redirect(session.url, 303);
}
