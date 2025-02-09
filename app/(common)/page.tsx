import HomePage from "../components/home/HomePage";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <HomePage/>
      </main>
    </div>
  );
}
