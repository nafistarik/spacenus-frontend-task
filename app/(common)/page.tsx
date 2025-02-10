import HomePage from "../components/home/HomePage";
import "leaflet/dist/leaflet.css";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center  w-full">
        <HomePage/>
      </main>
    </div>
  );
}
