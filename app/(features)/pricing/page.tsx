import { getProducts } from "./getproducts";
import { ProductListing } from "./productlisting";
import { createClient } from "@/utils/supabase/server";

export default async function Page(): Promise<JSX.Element> {
  const client = createClient();
  const user = await client.auth.getUser();
  const hasLicense = !!(
    user.data.user &&
    (
      await client
        .from("profiles")
        .select("license_id")
        .eq("id", user.data.user.id)
        .single()
    ).data?.license_id
  );

  const products = await getProducts();

  return (
    <section>
      {products.map(({ id, name, description, price, priceId }) => (
        <ProductListing
          key={id}
          id={id}
          priceId={priceId}
          name={name}
          description={description}
          price={price}
        />
      ))}
      {!hasLicense ? null : (
        <form method="POST" action="/api/checkout/portal-session">
          <button role="submit">Manage Subscription</button>
        </form>
      )}
    </section>
  );
}
