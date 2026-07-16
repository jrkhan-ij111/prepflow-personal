"use client";

import { MCQState, Source } from "@/types/mcq";

const SOURCE_KEY = "mcq-sources";
const PROGRESS_KEY = "mcq-progress";

export function loadSources(): Source[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(SOURCE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveSources(sources: Source[]) {
  localStorage.setItem(SOURCE_KEY, JSON.stringify(sources));
}

export function loadProgress(): MCQState {
  if (typeof window === "undefined") {
    return {
      sources: [],
      activeSourceId: null,
      topics: [],
      activeTopic: null,
      records: [],
    };
  }

  const data = localStorage.getItem(PROGRESS_KEY);

  if (!data)
    return {
      sources: [],
      activeSourceId: null,
      topics: [],
      activeTopic: null,
      records: [],
    };

  try {
    return JSON.parse(data);
  } catch {
    return {
      sources: [],
      activeSourceId: null,
      topics: [],
      activeTopic: null,
      records: [],
    };
  }
}

export function saveProgress(state: MCQState) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}