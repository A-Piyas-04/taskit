import Board from '@/components/Board';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-[url('/grid.png')] bg-repeat">
      <h1 className="text-4xl font-bold mb-8 text-center neon-text tracking-widest">TASK_IT_V1.0</h1>
      <Board />
    </main>
  );
}
