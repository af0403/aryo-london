import { redirect } from "next/navigation";
import EmailAgentAdmin from "./EmailAgentAdmin";

type Props = {
  searchParams: Promise<{ key?: string }>;
};

export default async function EmailAgentPage({ searchParams }: Props) {
  const params = await searchParams;
  if (params.key !== "aryo-admin-2024") {
    redirect("/");
  }

  return <EmailAgentAdmin adminKey={params.key} />;
}
