import PolygoneDetails from "./PolygoneDetails";

export default function PolygonePage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
          <h1 className=" font-bold text-4xl">This is Polygone Page</h1>
          <PolygoneDetails/>
        </main>
      </div>
    );
  }
  