import MapView from "./MapView";

export default function HomePage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
          <h1 className=" font-bold text-4xl">This is Poly Map</h1>
          <MapView/>
        </main>
      </div>
    );
  }
  