import "server-only";
import { createServiceClient } from "@/utils/supabase/service";

/**
 * @returns success
 */
export async function updateLicense(
  email: string,
  licenseId: number,
  pending = false
) {
  const client = await createServiceClient();

  const { error, data } = await client
    .from("profiles")
    .update({ license_id: licenseId, payment_pending: pending })
    .eq("email", email)
    .select()
    .single();

  if (error) {
    console.error(
      `Failed to update license due to error: ${JSON.stringify(error)}`
    );
    return false;
  }

  return true;
}
