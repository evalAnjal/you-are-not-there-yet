'use client';

export default function DeadDropHunter() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col items-center justify-between p-6">
      <header className="w-full text-center py-4">
        <h1 className="text-2xl font-bold">Dead Drop Hunter</h1>
      </header>
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-zinc-600">Loading...</p>
        </div>
      </main>
    </div>
  );
}