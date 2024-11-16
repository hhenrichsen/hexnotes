import "server-only";

import { createClient } from "@/utils/supabase/server";
import { Feature } from "./feature";
import { License } from "./license";

export async function withFeature(
  feature: Feature,
  success: () => void,
  failure: () => void
) {
  const client = createClient();
  const userResponse = await client.auth.getUser();
  const user = userResponse.data.user;
  if (!user) {
    failure();
    return;
  }

  const licenseIdResponse = await client
    .from("profiles")
    .select("license_id")
    .eq("id", user.id)
    .single();

  if (licenseIdResponse.error) {
    failure();
    return;
  }

  const licenseId = licenseIdResponse.data.license_id;

  if (licenseId == null) {
    failure();
    return;
  }

  const license = License.ById[licenseId];

  if (license.features.includes(feature)) {
    success();
  } else {
    failure();
  }
}
