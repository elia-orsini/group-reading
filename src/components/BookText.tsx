"use client";

import React, { useState, useEffect } from "react";
import readingSchedule from "../scripts/output.json";
import RecordButtons from "./RecordButtons";
import Chapter from "@/types/Chaper";
import { estimateReadingTime } from "@/utils/estimateReadingTime";

function BookText() {
  const [todayChapter, setTodayChapter] = useState<Chapter | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    try {
      const today = new Date().toLocaleDateString("en-CA");
      const chapter = (readingSchedule as any)[today];

      if (!chapter) {
        setError("No chapter scheduled for today");
      } else {
        setTodayChapter(chapter);
        setCurrentChapter(chapter);
      }
    } catch (err) {
      setError("Failed to load reading schedule");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChapterChange = (id: string) => {
    const vals = Object.values(readingSchedule);
    const selectedChapter = vals.find((o) => o.id === id);

    setCurrentChapter(selectedChapter!);
  };

  const returnToToday = () => {
    setCurrentChapter(todayChapter);
  };

  if (loading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading today{`'`}s reading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">
          {error}
        </div>
      </div>
    );

  if (!todayChapter)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-600">
          No reading scheduled for today
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {currentChapter?.id !== todayChapter?.id && (
            <button
              onClick={returnToToday}
              className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-blue-700 transition-all hover:bg-blue-100"
            >
              ← Today&apos;s Chapter
            </button>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="chapter-select" className="mb-2 block font-medium text-gray-700">
            Select Chapter:
          </label>
          <select
            onChange={(e) => handleChapterChange(e.target.value)}
            value={currentChapter?.id || ""}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {Object.entries(readingSchedule).map(([date, chapter]) => (
              <option key={date} value={chapter.id}>
                {date}: {(chapter as Chapter).title}
              </option>
            ))}
          </select>
        </div>

        <RecordButtons
          chapter={currentChapter || todayChapter}
          isTodayChapter={todayChapter === currentChapter}
        />

        <div className="mt-8 space-y-6">
          <h2 className="border-b border-gray-100 pb-4 text-2xl font-bold capitalize text-gray-800">
            {currentChapter?.title || todayChapter.title}
          </h2>

          {(currentChapter?.content || todayChapter.content) && (
            <p className="prose prose-lg mt-4 text-gray-700 opacity-80">
              <span className="opacity-60">Estimated Reading Time: </span>
              <span>{estimateReadingTime(currentChapter?.content || todayChapter.content)}</span>
            </p>
          )}

          <div className="prose prose-lg max-w-none text-gray-700">
            {(currentChapter?.content || todayChapter.content).split("\n").map((para, i) => (
              <p key={i} className="my-4 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookText;
