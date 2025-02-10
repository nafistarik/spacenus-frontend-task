import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const HomePage = dynamic(() => import("../components/home/HomePage"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center w-full">
        <HomePage />
      </main>
    </div>
  );
}
