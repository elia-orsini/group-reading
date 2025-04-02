import Link from "next/link";

async function getChapterReadings() {
  try {
    const res = await fetch(`https://group-reading.vercel.app/api/readings`, {
      next: { revalidate: 60 },
    });

    if (res.ok) return await res.json();

    throw new Error("Both relative and absolute URLs failed");
  } catch {
    return { readings: [] };
  }
}

export default async function RecapPage() {
  const { readings } = await getChapterReadings();

  readings.sort((a: any, b: any) => {
    const dateA: any = new Date(a.date.S);
    const dateB: any = new Date(b.date.S);

    return dateA - dateB;
  });

  const readingMap = readings?.reduce((acc: any, reading: any) => {
    const chapterId = reading.chapterId.S;
    const person = reading.person.S;
    acc[chapterId] = acc[chapterId] || {};
    acc[chapterId][person] = true;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-lg font-bold text-[var(--foreground)] opacity-80 sm:text-3xl">
            Reading History
          </h1>
          <Link
            href="/"
            className="flex items-center opacity-80 gap-1 rounded-lg border border-[var(--foreground)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] transition-all hover:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-base"
          >
            ← Back to Reading
          </Link>
        </div>

        <div className="border-[var(--foreground)]/40 overflow-hidden rounded-xl border bg-[var(--background)] shadow-sm">
          {/* Table Header */}
          <div className="border-[var(--foreground)]/40 grid grid-cols-12 border-b bg-[var(--background)] p-4 font-medium text-[var(--foreground)]">
            <div className="col-span-6 pl-6">Chapter</div>
            <div className="col-span-3 text-center">依依</div>
            <div className="col-span-3 text-center">沁瑜</div>
          </div>

          {/* Table Rows */}
          {Object.keys(readingMap).map((title: any) => (
            <div
              key={title}
              className="border-[var(--foreground)]/40 grid grid-cols-12 border-b p-4 transition-colors"
            >
              <div className="col-span-6 flex items-center pl-6 font-medium text-[var(--foreground)]">
                <span className="truncate capitalize">{title}</span>
              </div>

              <div className="col-span-3 flex justify-center">
                <StatusBadge read={readingMap?.[title]?.["yiyi"]} person="yiyi" />
              </div>

              <div className="col-span-3 flex justify-center">
                <StatusBadge read={readingMap?.[title]?.["qinyu"]} person="qinyu" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ read, person }: { read: boolean; person: string }) {
  return (
    <button
      className={`relative min-w-[60px] rounded-lg border px-4 py-2 text-sm transition-all sm:min-w-[100px] ${
        read
          ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
          : "border-red-400 bg-red-300 text-gray-700 shadow-inner hover:bg-gray-50"
      } focus:outline-none`}
      disabled={read}
    >
      {read ? (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 pt-0.5 text-xs text-white">
          ✓
        </span>
      ) : (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 pl-0.5 text-xs text-white">
          x
        </span>
      )}
      {person === "yiyi" ? "依依" : "沁瑜"}
    </button>
  );
}
