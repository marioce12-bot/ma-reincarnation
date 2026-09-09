import ConfirmClient from "./ConfirmClient";

export const dynamic = "force-dynamic";

export default async function PaiementSuccesPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string; plan?: string; ref?: string }>;
}) {
  const sp = await searchParams;
  return (
    <ConfirmClient sessionId={sp.session ?? null} plan={sp.plan ?? null} refParam={sp.ref ?? null} />
  );
}
