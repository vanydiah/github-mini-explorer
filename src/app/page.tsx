import GitHubExplorer from "./App";

export default function Home() {
  return (
    <div className="relative font-[family-name:var(--font-geist-sans) min-h-screen">
      <div className='stars'></div>
      <div className='twinkling'></div>
      <div className='clouds'></div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start relative z-10">
        <GitHubExplorer />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center absolute bottom-0 left-0 right-0 z-10">
        <div className="text-white text-sm w-full p-6 text-center flex justify-center items-center">
          Github Mini Explorer by
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 ml-1"
            href="https://vanydiah.framer.website"
            target="_blank"
            rel="noopener noreferrer"
          >
             Vany Diah
          </a>
          . 2025
        </div>
      </footer>
    </div>
  );
}
