"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PwaNavControls() {
  const router = useRouter();
  const pathname = usePathname();

  const [isStandalone, setIsStandalone] = useState(false);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [position, setPosition] = useState(0);

  // Detect installed/standalone window
  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const update = () => setIsStandalone(standaloneQuery.matches);
    update();
    standaloneQuery.addEventListener("change", update);
    return () => standaloneQuery.removeEventListener("change", update);
  }, []);

  // Track our own navigation stack based on pathname changes
  useEffect(() => {
    setHistoryStack((prevStack) => {
      // If we're already at this path (e.g. back/forward brought us here), don't push
      if (prevStack[position] === pathname) return prevStack;

      // New forward navigation: drop any "forward" entries beyond current position, push new path
      const newStack = [...prevStack.slice(0, position + 1), pathname];
      setPosition(newStack.length - 1);
      return newStack;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const canGoBack = position > 0;
  const canGoForward = position < historyStack.length - 1;

  const handleBack = () => {
    if (!canGoBack) return;
    setPosition((p) => p - 1);
    router.back();
  };

  const handleForward = () => {
    if (!canGoForward) return;
    setPosition((p) => p + 1);
    router.forward();
  };

  useEffect(() => {
    if (!isStandalone) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleForward();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStandalone, position, historyStack]);

  if (!isStandalone) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0.75rem",
        left: "0.75rem",
        zIndex: 50,
        display: "flex",
        gap: "0.375rem",
      }}
    >
      <button
        type="button"
        onClick={handleBack}
        disabled={!canGoBack}
        aria-label="আগের পেজে যান"
        title="Back (Alt + ←)"
        style={navButtonStyle(canGoBack)}
      >
        ←
      </button>
      <button
        type="button"
        onClick={handleForward}
        disabled={!canGoForward}
        aria-label="পরের পেজে যান"
        title="Forward (Alt + →)"
        style={navButtonStyle(canGoForward)}
      >
        →
      </button>
    </div>
  );
}

function navButtonStyle(enabled: boolean): React.CSSProperties {
  return {
    width: "2rem",
    height: "2rem",
    borderRadius: "9999px",
    border: "1px solid rgba(0,0,0,0.1)",
    background: enabled ? "#10b981" : "#d1d5db",
    color: "white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: 1,
  };
}