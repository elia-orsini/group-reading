import Chapter from "@/types/Chaper";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RecordButtons({
  chapter,
  isTodayChapter,
}: {
  chapter: Chapter;
  isTodayChapter: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [readStatus, setReadStatus] = useState({ yiyi: false, qinyu: false });

  // Fetch reading status on component mount
  useEffect(() => {
    const fetchReadingStatus = async () => {
      try {
        const response = await fetch(`/api/record-reading?chapterId=${chapter.id}`, {
          next: { revalidate: 120 },
        });

        const data = await response.json();

        if (data.readings) {
          const newStatus = {
            yiyi: data.readings.some((r: any) => r.person.S === "yiyi"),
            qinyu: data.readings.some((r: any) => r.person.S === "qinyu"),
          };
          setReadStatus(newStatus);
        }
      } catch (error) {
        console.error("Failed to fetch reading status:", error);
      }
    };

    fetchReadingStatus();
  }, [chapter.id]);

  const toggleReading = async (person: "yiyi" | "qinyu") => {
    setLoading(true);

    try {
      const method = readStatus[person] ? "DELETE" : "POST";
      const response = await fetch("/api/record-reading", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId: chapter.id, person }),
      });

      if (response.ok) {
        setReadStatus((prev) => ({ ...prev, [person]: !prev[person] }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 flex flex-row items-center justify-between gap-4 text-sm sm:flex-row sm:text-base">
      <div className="flex gap-3">
        <button
          onClick={() => toggleReading("yiyi")}
          disabled={loading || !isTodayChapter}
          className={`relative min-w-[60px] rounded-lg border px-4 py-2 opacity-80 transition-all hover:opacity-60 disabled:opacity-50 sm:min-w-[100px] ${
            readStatus.yiyi
              ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
              : "border-gray-300 bg-[var(--background)]"
          } ${loading ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50`}
        >
          {readStatus.yiyi && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              ✓
            </span>
          )}
          依依
        </button>

        <button
          onClick={() => toggleReading("qinyu")}
          disabled={loading || !isTodayChapter}
          className={`relative min-w-[60px] rounded-lg border px-4 py-2 opacity-80 transition-all hover:opacity-60 disabled:opacity-50 sm:min-w-[100px] ${
            readStatus.qinyu
              ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
              : "border-gray-300 bg-[var(--background)]"
          } ${loading ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50`}
        >
          {readStatus.qinyu && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              ✓
            </span>
          )}
          沁瑜
        </button>
      </div>

      <Link
        href="/recap"
        className="rounded-lg border border-gray-300 bg-[var(--background)] px-4 py-2 text-[var(--foreground)] opacity-80 transition-colors hover:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Reading History →
      </Link>
    </div>
  );
}
