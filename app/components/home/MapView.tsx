"use client";

import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { LatLngExpression } from "leaflet";
import * as turf from "@turf/turf";  
import { Icon } from "leaflet";

export default function MapView() {
  const [polygonCoords, setPolygonCoords] = useState<LatLngExpression[]>([]);
  const [polygons, setPolygons] = useState<{
    id: string;
    coordinates: LatLngExpression[];
    borderColor: string;
    fillColor: string;
    area: number;
  }[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [drawingInProgress, setDrawingInProgress] = useState(false);
  const [editMode, setEditMode] = useState<{ id: string | null; newCoords: LatLngExpression[]; borderColor: string; fillColor: string }>({
    id: null,
    newCoords: [],
    borderColor: "#3498db",
    fillColor: "#3498db",
  });

  function AddPolygonHandler() {
    useMapEvents({
      click(e) {
        // console.log("Click event:", e.latlng);
        if (polygonCoords.length < 4) {
          setPolygonCoords((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
        } else if (polygonCoords.length === 4) {
          setPolygonCoords((prev) => [...prev, prev[0]]);
          setDrawingInProgress(false);
        }
        if (polygonCoords.length === 3) {
          setDrawingInProgress(true);
        }
      },
    });

    return null;
  }

  const calculatePolygonCenter = (coordinates: LatLngExpression[]) => {
    const latitudes = coordinates.map(coord => (coord as [number, number])[0]);
    const longitudes = coordinates.map(coord => (coord as [number, number])[1]);

    const centerLat = latitudes.reduce((a, b) => a + b, 0) / coordinates.length;
    const centerLng = longitudes.reduce((a, b) => a + b, 0) / coordinates.length;

    return [centerLat, centerLng] as LatLngExpression;
  };

  const calculatePolygonArea = (coordinates: LatLngExpression[]) => {
    if (coordinates.length < 4) return 0;  

    const closedCoordinates = [...coordinates];
    if (closedCoordinates[0] !== closedCoordinates[closedCoordinates.length - 1]) {
      closedCoordinates.push(closedCoordinates[0]);
    }

    const polygon = turf.polygon([closedCoordinates as number[][]]);
    // console.log("Polygon area:", turf.area(polygon)); 
    return turf.area(polygon);
  };

  const savePolygon = () => {
    if (polygonCoords.length >= 4) {
      const area = calculatePolygonArea(polygonCoords);
      setPolygons((prev) => [
        ...prev,
        { id: idCounter.toString(), coordinates: polygonCoords, borderColor: "#3498db", fillColor: "#3498db", area },
      ]);
      setIdCounter(idCounter + 1);
      setPolygonCoords([]);
      setDrawingInProgress(false);
      // console.log(`Polygon created!`); 
      alert(`Polygon with ID ${idCounter} has been created!`);
    }
  };

  const startEditing = (id: string) => {
    // console.log("editing:", id); 
    const polygonToEdit = polygons.find((polygon) => polygon.id === id);
    if (polygonToEdit) {
      setEditMode({
        id: id,
        newCoords: polygonToEdit.coordinates,
        borderColor: polygonToEdit.borderColor,
        fillColor: polygonToEdit.fillColor,
      });
    }
  };

  const saveEditedPolygon = () => {
    if (editMode.id && editMode.newCoords.length >= 4) {
      const area = calculatePolygonArea(editMode.newCoords);
      setPolygons((prev) =>
        prev.map((polygon) =>
          polygon.id === editMode.id
            ? { ...polygon, coordinates: editMode.newCoords, borderColor: editMode.borderColor, fillColor: editMode.fillColor, area }
            : polygon
        )
      );
      setEditMode({ id: null, newCoords: [], borderColor: "#3498db", fillColor: "#3498db" });

      alert(`Polygon has been updated!`);
    }
  };

  const deletePolygon = (id: string) => {
    setPolygons((prev) => prev.filter((polygon) => polygon.id !== id));
    // console.log("deleted id :", id); 
  };

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [38, 38], 
  });

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
          {polygonCoords.length >= 3 && <Polygon pathOptions={{ color: "#968581" }} positions={polygonCoords} />}
          {polygons.map((polygon) => {
            const center = calculatePolygonCenter(polygon.coordinates);
            return (
              <>
                <Polygon
                  key={polygon.id}
                  pathOptions={{
                    color: polygon.borderColor,
                    fillColor: polygon.fillColor,
                    fillOpacity: 0.5,
                  }}
                  positions={polygon.coordinates}
                  eventHandlers={{
                    click: () => startEditing(polygon.id),
                  }}
                />
                <Marker position={center} icon={customIcon}>
                  <Popup>
                    <span>Area: {polygon.area.toFixed(2)} m²</span>
                  </Popup>
                </Marker>
              </>
            );
          })}
          {editMode.id && (
            <Polygon
              pathOptions={{
                color: editMode.borderColor,
                fillColor: editMode.fillColor,
                fillOpacity: 0.5,
              }}
              positions={editMode.newCoords}
            />
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

      {editMode.id && (
        <div className="flex gap-4 mt-4">
          <div>
            <label htmlFor="borderColor" className="block">Border Color</label>
            <input
              type="color"
              id="borderColor"
              value={editMode.borderColor}
              onChange={(e) => setEditMode((prev) => ({ ...prev, borderColor: e.target.value }))} 
              className="w-12 h-12"
            />
          </div>
          <div>
            <label htmlFor="fillColor" className="block">Fill Color</label>
            <input
              type="color"
              id="fillColor"
              value={editMode.fillColor}
              onChange={(e) => setEditMode((prev) => ({ ...prev, fillColor: e.target.value }))} 
              className="w-12 h-12"
            />
          </div>
        </div>
      )}

<div className="flex flex-col items-center justify-center space-y-4 w-full max-w-md">
  {polygons.length === 0 ? (
    <p className="text-black font-bold">No polygons drawn yet. Click on the map at least 4 times!</p>
  ) : (
    polygons.map((polygon) => (
      <div
        key={polygon.id}
        className="w-full p-4 rounded-lg shadow-md bg-[#f1ddd9] mb-4 flex flex-col gap-2"
      >
        <div className="flex justify-between items-center">
          <span className="text-black text-base font-semibold">Polygon {polygon.id}</span>
          <div className="flex gap-2">
            <button
              onClick={() => startEditing(polygon.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => deletePolygon(polygon.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Delete
            </button>
          </div>
        </div>
        <p className="text-sm text-black mt-2">
          <strong>Coordinates:</strong> {JSON.stringify(polygon.coordinates)}
        </p>
        <p className="text-sm text-black mt-2">
          <strong>Area:</strong> {polygon.area.toFixed(2)} m²
        </p>
      </div>
    ))
  )}
</div>

    </div>
  );
}
