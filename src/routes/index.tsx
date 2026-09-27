import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useEffect(() => {
    window.location.replace("/peixe.html" + window.location.hash);
  }, []);
  return (
    <main className="peixe-boot">
      <p>O Pescador</p>
    </main>
  );
}
