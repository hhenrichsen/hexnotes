import { stripeClient } from "@/utils/stripe/stripe";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const user = await createClient().auth.getUser();

  if (user.error) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`);
  }

  const customerResponse = await stripeClient.customers.search({
    query: `email:'${user.data.user.email}'`,
    limit: 1,
  });

  const [customer] = customerResponse.data;

  if (!customer) {
    return Response.json(
      { error: "Failed to retrieve customer" },
      { status: 500 }
    );
  }

  const billingSession = await stripeClient.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
  });

  if (!billingSession || !billingSession.url) {
    return Response.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }

  return Response.redirect(billingSession.url, 303);
}
