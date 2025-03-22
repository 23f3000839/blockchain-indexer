import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

const CallbackPage = async ({
  searchParams,
}: {
  searchParams: { topic?: string };
}) => {
  const user = await currentUser();
  const topic = searchParams.topic;

  if (user) {
    return redirect(topic ? `/dashboard?topic=${topic}` : "/dashboard");
  } else {
    return redirect("/auth/sign-in");
  }
};

export default CallbackPage;
