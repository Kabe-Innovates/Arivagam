import { Header } from "@/components/layout/header";

export default function ProfilePage() {
  return (
    <>
      <Header title="Profile" />
      <div className="p-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-zinc-500">Profile module — coming soon.</p>
        </div>
      </div>
    </>
  );
}
