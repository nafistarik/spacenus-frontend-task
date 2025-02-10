"use client";

import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { LatLngExpression } from "leaflet";

export default function MapView() {
  const [polygonCoords, setPolygonCoords] = useState<LatLngExpression[]>([]);
  const [polygons, setPolygons] = useState<{ id: string; coordinates: LatLngExpression[]; color: string }[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [drawingInProgress, setDrawingInProgress] = useState(false);
  const [editMode, setEditMode] = useState<{ id: string | null; newCoords: LatLngExpression[] }>({
    id: null,
    newCoords: [],
  });

  // console.log(polygonCoords)
  // console.log(polygons)
  // console.log(idCounter)
  // console.log(drawingInProgress)
  // console.log(editMode)

  function AddPolygonHandler() {
    useMapEvents({
      click(e) {
        if (polygonCoords.length < 2) {
          setPolygonCoords((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
        } else {
          setPolygonCoords([polygonCoords[0], polygonCoords[1], [e.latlng.lat, e.latlng.lng]]);
        }

        if (polygonCoords.length === 2) {
          setDrawingInProgress(true);
        }
      },
    });

    return null;
  }

  const savePolygon = () => {
    if (polygonCoords.length > 2) {
      setPolygons((prev) => [
        ...prev,
        { id: idCounter.toString(), coordinates: polygonCoords, color: "#3498db" },
      ]);
      setIdCounter(idCounter + 1);
      setPolygonCoords([]);
      setDrawingInProgress(false);
      alert(`Polygon with ID ${idCounter} has been created!`);
    }
  };

  const startEditing = (id: string) => {
    // console.log(id);
    const polygonToEdit = polygons.find((polygon) => polygon.id === id);
    if (polygonToEdit) {
      setEditMode({
        id: id,
        newCoords: polygonToEdit.coordinates,
      });
    }
  };

  const saveEditedPolygon = () => {
    if (editMode.id && editMode.newCoords.length > 2) {
      setPolygons((prev) =>
        prev.map((polygon) =>
          polygon.id === editMode.id
            ? { ...polygon, coordinates: editMode.newCoords, color: "#e74c3c" }
            : polygon
        )
      );
      setEditMode({ id: null, newCoords: [] });
      alert(`Polygon has been updated!`);
    }
  };

  const deletePolygon = (id: string) => {
    // console.log(id);
    setPolygons((prev) => prev.filter((polygon) => polygon.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-[400px] w-full max-w-md rounded-xl overflow-hidden">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenReady={() => console.log("Map is ready!")}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <AddPolygonHandler />
          {polygonCoords.length > 2 && <Polygon pathOptions={{ color: "#968581" }} positions={polygonCoords} />}
          {polygons.map((polygon) => (
            <Polygon
              key={polygon.id}
              pathOptions={{ color: polygon.color }}
              positions={polygon.coordinates}
              eventHandlers={{
                click: () => startEditing(polygon.id),
              }}
            />
          ))}
          {editMode.id && (
            <Polygon pathOptions={{ color: "#3498db" }} positions={editMode.newCoords} />
          )}
        </MapContainer>
      </div>


      <button
        onClick={editMode.id ? saveEditedPolygon : savePolygon}
        className="bg-green-500 text-white px-4 py-2 mt-4 mb-6 rounded"
      >
        {editMode.id ? "Save Edits" : "Save Polygon"}
      </button>

      {drawingInProgress && <p className="text-black font-bold">Drawing polygon... Click to save!</p>}



      <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-md">
        {polygons.length === 0 ? (
          <p className="text-black font-bold">No polygons drawn yet. Click on the map at least 3 times!</p>
        ) : (
          polygons.map((polygon) => (
            <div
              key={polygon.id}
              className="w-full p-4 rounded-lg shadow-md bg-[#ededed] mb-4 flex justify-between items-center"
            >
              <div>
                <span className="text-black text-sm font-semibold">Polygon {polygon.id}</span>
                <p className="text-sm text-black mt-2">Coordinates: {JSON.stringify(polygon.coordinates)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(polygon.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePolygon(polygon.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
