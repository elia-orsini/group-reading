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
  const [readStatus, setReadStatus] = useState({ ace: false, elia: false, chri: false });

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
            ace: data.readings.some((r: any) => r.person.S === "ace"),
            elia: data.readings.some((r: any) => r.person.S === "elia"),
            chri: data.readings.some((r: any) => r.person.S === "chri"),
          };
          setReadStatus(newStatus);
        }
      } catch (error) {
        console.error("Failed to fetch reading status:", error);
      }
    };

    fetchReadingStatus();
  }, [chapter.id]);

  const toggleReading = async (person: "ace" | "elia" | "chri") => {
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
          onClick={() => toggleReading("ace")}
          disabled={loading || !isTodayChapter}
          className={`relative min-w-[60px] rounded-lg border px-4 py-2 transition-all disabled:opacity-50 sm:min-w-[100px] ${
            readStatus.ace
              ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
              : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
          } ${loading ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50`}
        >
          {readStatus.ace && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              ✓
            </span>
          )}
          ace
        </button>

        <button
          onClick={() => toggleReading("elia")}
          disabled={loading || !isTodayChapter}
          className={`relative min-w-[60px] rounded-lg border px-4 py-2 transition-all disabled:opacity-50 sm:min-w-[100px] ${
            readStatus.elia
              ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
              : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
          } ${loading ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50`}
        >
          {readStatus.elia && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              ✓
            </span>
          )}
          elia
        </button>

        <button
          onClick={() => toggleReading("chri")}
          disabled={loading || !isTodayChapter}
          className={`relative min-w-[60px] rounded-lg border px-4 py-2 transition-all disabled:opacity-50 sm:min-w-[100px] ${
            readStatus.chri
              ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
              : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
          } ${loading ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50`}
        >
          {readStatus.chri && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              ✓
            </span>
          )}
          chri
        </button>
      </div>

      <Link
        href="/recap"
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Reading History →
      </Link>
    </div>
  );
}
