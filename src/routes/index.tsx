import { createSignal, onCleanup, onMount } from "solid-js";
import { supabase } from "../lib/supabaseClient";

type Option = {
  id: number;
  poll_id: number;
  option_text: string;
  votes: number;
};

export default function Home() {
  const [options, setOptions] = createSignal<Option[]>([]);
  const [pollQuestion, setPollQuestion] = createSignal("");

  // Load poll and options
  onMount(async () => {
    const pollRes = await supabase.from("polls").select("*").eq("id", 1).single();
    setPollQuestion(pollRes.data.question);

    const optionsRes = await supabase.from("poll_options").select("*").eq("poll_id", 1);
    setOptions(optionsRes.data);

    // Subscribe to realtime updates on poll_options
    const channel = supabase
      .channel("poll_options_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "poll_options" },
        (payload) => setOptions(prev => prev.map(opt => opt.id === payload.new.id ? payload.new : opt))
      )
      .subscribe();

    onCleanup(() => supabase.removeChannel(channel));
  });

  const vote = async (optionId: number) => {
    const option = options().find(o => o.id === optionId);
    if (!option) return;

    await supabase
      .from("poll_options")
      .update({ votes: option.votes + 1 })
      .eq("id", optionId);
  };

  const totalVotes = () => options().reduce((sum, o) => sum + o.votes, 0);

  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 class="text-3xl font-bold mb-6">{pollQuestion()}</h1>

      <div class="w-full max-w-md space-y-4">
        {options().map((opt) => (
          <div class="bg-white p-4 rounded shadow flex flex-col">
            <div class="flex justify-between items-center mb-2">
              <span>{opt.option_text}</span>
              <span>{opt.votes} votes</span>
            </div>
            <div class="bg-gray-300 h-4 rounded overflow-hidden mb-2">
              <div
                class="bg-green-500 h-4 rounded"
                style={{ width: `${(opt.votes / (totalVotes() || 1)) * 100}%` }}
              ></div>
            </div>
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => vote(opt.id)}
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
