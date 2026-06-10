export default function CoachCard({ report }) {
  if (!report) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6 text-left">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        🎹 AI Coach Report
      </h3>

      {report.trends && report.trends.length > 0 && (
        <div className="mb-4">
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Trends vs Last Session</p>
          <ul className="space-y-1">
            {report.trends.map((trend, i) => (
              <li key={i} className="text-sm font-semibold">{trend}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Strengths</p>
          {report.strengths.length > 0 ? (
            <ul className="space-y-2">
              {report.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>{str.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-600 italic">Keep playing to find strengths!</p>
          )}
        </div>

        <div>
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Needs Work</p>
          {report.weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {report.weaknesses.map((weak, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={weak.severity === "high" ? "text-red-500" : "text-orange-500"}>•</span>
                  <span>{weak.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-600 italic">No specific weaknesses detected.</p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-800">
        <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Recommendation</p>
        {report.recommendations.length > 0 ? (
          <p className="font-semibold text-orange-500">{report.recommendations[0].recommendation}</p>
        ) : (
          <p className="text-zinc-500">Keep practicing steadily.</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800">
        <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Estimated Mastery</p>
        <p className="font-bold text-white">{report.masteryEstimate}</p>
      </div>
    </div>
  );
}
