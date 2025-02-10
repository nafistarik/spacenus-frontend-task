import MapView from "./MapView";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center w-full">
        <h1 className=" font-bold text-2xl mb-6">Add polygons on the map</h1>
        <MapView />
      </main>
    </div>
  );
}
