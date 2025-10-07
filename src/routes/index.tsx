import { createSignal, onCleanup, onMount } from "solid-js";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [score, setScore] = createSignal({ team_a: 0, team_b: 0, match_name: "" });

  onMount(async () => {
    // Load initial score
    const { data } = await supabase.from("scores").select("*").eq("id", 1).single();
    setScore(data);

    // Subscribe to realtime updates
    const channel = supabase
      .channel("score_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scores" },
        (payload) => setScore(payload.new)
      )
      .subscribe();

    onCleanup(() => supabase.removeChannel(channel));
  });

  const updateScore = async (team: "team_a" | "team_b") => {
    const newScore = { ...score(), [team]: score()[team] + 1 };
    await supabase.from("scores").update(newScore).eq("id", 1);
  };

  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 class="text-4xl font-bold mb-6">🏏 {score().match_name}</h1>
      <div class="flex gap-10 text-2xl font-semibold">
        <div class="flex flex-col items-center">
          <p>Team A: {score().team_a}</p>
          <button class="bg-green-600 text-white px-4 py-2 rounded mt-2" onClick={() => updateScore("team_a")}>+1 Run</button>
        </div>
        <div class="flex flex-col items-center">
          <p>Team B: {score().team_b}</p>
          <button class="bg-blue-600 text-white px-4 py-2 rounded mt-2" onClick={() => updateScore("team_b")}>+1 Run</button>
        </div>
      </div>
    </div>
  );
}
