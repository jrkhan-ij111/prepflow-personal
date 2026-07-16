export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100dvh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1>You&apos;re offline</h1>
      <p>Check your internet connection and try again.</p>
    </main>
  );
}