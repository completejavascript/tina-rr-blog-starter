import { Welcome } from "~/components/Welcome";
import type { Route } from "./+types/home";
import { MainLayout } from "~/layouts/MainLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function HomeRoute() {
  return (
    <MainLayout>
      <Welcome />
    </MainLayout>
  );
}
