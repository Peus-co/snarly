import MagicBento from "./MagicBento";

/* Small custom pictures inside the cards (MagicBento accepts any JSX as `visual`) */
function FilesVisual() {
  const files = ["report.pdf", "contract.pdf", "notes.pdf"];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1.5 px-4">
      {files.map((name) => (
        <div key={name} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
          <span className="rounded bg-red-500/80 px-1.5 py-0.5 text-[10px] font-bold text-white">PDF</span>
          {name}
        </div>
      ))}
    </div>
  );
}

function ChatVisual() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 px-6 text-sm">
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-white/15 px-4 py-2 text-white">
        Compare the refund rules in both contracts.
      </div>
      <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-2 text-white/80">
        Both contracts allow refunds within 30 days, but only the second one covers digital items…
      </div>
    </div>
  );
}

// Edit the text here. colSpan / rowSpan = how many grid cells a card covers (grid is 4 columns).
const items = [
  {
    title: "Chat with many PDFs at once",
    description: "Upload several documents and ask one question across all of them.",
    visual: <ChatVisual />,
    colSpan: 2,
    rowSpan: 2,
  },
  {
    title: "Upload any PDF",
    description: "Papers, contracts, notes.",
    visual: <FilesVisual />,
  },
  {
    title: "Understands meaning",
    description: "Finds the right passage even when your words are different.",
  },
  {
    title: "Answers from your documents",
    description: "Snarly AI first retrieves the relevant parts of your files (RAG), then answers from them, so replies stay grounded.",
    colSpan: 2,
  },
  {
    title: "Your chats are saved",
    description: "Come back anytime and continue from your chat history.",
    colSpan: 4,
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#151515] px-4 pb-20 pt-28 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">About Snarly AI</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Snarly AI is a multi-PDF chatbot. Upload your documents, ask questions in plain
            language, and get answers drawn from your own files, not guesses.
          </p>
        </div>

        <MagicBento
          items={items}
          columns={4}
          rowHeight={200}
          gap={12}
          radius={20}
          enableBorderGlow
          enableSpotlight
          spotlightRadius={300}
          clickEffect
          enableStars={false}
          enableTilt={false}
          enableMagnetism={false}
          textAutoHide
          intro
        />
      
        
      </div>
    </div>
  );
}