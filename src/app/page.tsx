import BookText from "@/components/BookText";

export default async function IndexPage() {
  return (
    <main className="flex h-dvh w-screen flex-col justify-between font-semibold sm:h-screen">
      <BookText />
    </main>
  );
}
