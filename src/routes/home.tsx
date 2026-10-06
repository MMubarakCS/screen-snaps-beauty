import { createFileRoute } from "@tanstack/react-router";
import { PublicLanding } from "@/routes/index";

export const Route = createFileRoute("/home")({
  component: PublicLanding,
});
