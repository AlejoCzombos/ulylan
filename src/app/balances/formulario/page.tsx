import PageClient from "./pageClient";

export default async function FormularioBalance({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const id = (await searchParams).id;

  return <PageClient id={id} />;
}
