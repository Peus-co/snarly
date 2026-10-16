import "./hero.css";
import Nave from "./nave";
import LightRays from './LightRays';

export default function Hero({ onGetStarted }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b]">
      {/* Background effect */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.6}
          lightSpread={1.8}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.5}
          noiseAmount={0.01}
          distortion={0}
          className="custom-rays"
          pulsating
          fadeDistance={2}
          saturation={0.9}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/40" />

      {/* Hero content */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-28 pt-24 text-center">
        <span className="mb-6 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300">
          AI-Powered Document Intelligence
        </span>

        <h1 className="max-w-5xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl">
          Chat with{" "}
          <span className="  bg-transparent">
            All Your Documents.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
          Upload multiple PDFs, ask questions in natural language, and find
          answers across your documents in seconds. Less searching, more
          understanding.
        </p>

  
<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
  <button 
    onClick={onGetStarted}
    className="glass-button cursor-pointer"
  >
  Start chatting ↗
</button>

  <a
    href="#features"
    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3 font-medium text-white/90 backdrop-blur-md transition hover:border-white/30 hover:bg-white/10"
  >
    Explore features
  </a>
</div>

      </section>

      {/* Fixed top navigation */}
      <Nave activeIndex={0} onGetStarted={onGetStarted} />
    </main>
  );
}
