export default function AmbientGlow() {
    return (
        <>
            <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-[180px]" />

            <div className="absolute top-[500px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-[160px]" />

            <div className="absolute top-[800px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-cyan-500/5 blur-[180px]" />
        </>
    );
  }