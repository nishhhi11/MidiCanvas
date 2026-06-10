import { useNavigate } from "react-router-dom";

export default function ContinueLearning() {
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        Continue Learning
      </h2>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-zinc-400">
            Current Song
          </p>

          <h3 className="text-xl font-semibold mt-1">
            Kesariya
          </h3>

          <p className="text-sm text-zinc-500 mt-2">
            Progress 42%
          </p>
        </div>

        <button
          onClick={() => navigate("/learn")}
          className="px-5 py-3 rounded-xl bg-orange-500 text-black font-semibold"
        >
          Resume
        </button>
      </div>
    </div>
  );
}
