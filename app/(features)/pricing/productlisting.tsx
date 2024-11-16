"use client";

export function ProductListing({
  id,
  name,
  description,
  priceId,
  price,
}: {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: string;
}) {
  return (
    <form method="POST" action="/api/checkout/checkout-session">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="priceId" value={priceId} />
      <button
        role="submit"
        className="max-w-prose border-white rounded-md border-2 p-2"
      >
        <h2>{name}</h2>
        <p>{description}</p>
        <p>{price}</p>
      </button>
    </form>
  );
}
