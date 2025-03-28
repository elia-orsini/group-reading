"use client";

import React, { useState, useEffect } from "react";
import readingSchedule from "../scripts/output.json";
import RecordButtons from "./RecordButtons";
import Chapter from "@/types/Chapter";

function BookText() {
  const [todayChapter, setTodayChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const chapter = readingSchedule[today];

      if (!chapter) {
        setError("No chapter scheduled for today");
      } else {
        setTodayChapter(chapter);
      }
    } catch (err) {
      setError("Failed to load reading schedule");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

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
        <RecordButtons chapter={todayChapter} />

        <div className="mt-8 space-y-6">
          <h2 className="border-b border-gray-100 pb-4 text-2xl font-bold text-gray-800">
            {todayChapter.title}
          </h2>

          <div className="prose prose-lg max-w-none text-gray-700">
            {todayChapter.content.split("\n").map((para, i) => (
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
