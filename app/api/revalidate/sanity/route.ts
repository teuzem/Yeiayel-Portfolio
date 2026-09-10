import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const configuredSecret = process.env.SANITY_REVALIDATE_SECRET;
  const suppliedSecret =
    request.headers.get("x-sanity-revalidate-secret") ||
    new URL(request.url).searchParams.get("secret");

  if (
    !configuredSecret ||
    !suppliedSecret ||
    suppliedSecret !== configuredSecret
  ) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidateTag("sanity", "max");
  revalidatePath("/", "layout");
  revalidatePath("/blog");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
