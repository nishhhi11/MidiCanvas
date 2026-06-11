export default function BackgroundEffects() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050816]">
            {/* Purple Light */}
            <div className="absolute top-[-150px] left-[-100px] h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[180px]" />

            {/* Pink Light */}
            <div className="absolute top-[100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-pink-500/20 blur-[180px]" />

            {/* Orange Light */}
            <div className="absolute bottom-[-100px] left-1/3 h-[600px] w-[600px] rounded-full bg-orange-500/15 blur-[220px]" />

            {/* Gold Light */}
            <div className="absolute bottom-[50px] right-[10%] h-[400px] w-[400px] rounded-full bg-yellow-400/10 blur-[160px]" />

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
              linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
            `,
                    backgroundSize: "60px 60px",
                }}
            />
        </div>
    );
  }