'use client';

import React, { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';

const LeafletMapContainer = MapContainer as React.ComponentType<any>;
const LeafletCircleMarker = CircleMarker as React.ComponentType<any>;

type LocationMapPickerProps = {
  lat: string;
  lng: string;
  onPick: (lat: string, lng: string) => void;
  onClose: () => void;
};

function parseCoordinate(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event: any) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapCenterSync({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: false });
  }, [center, map]);

  return null;
}

export default function LocationMapPicker({ lat, lng, onPick, onClose }: LocationMapPickerProps) {
  const selectedLat = parseCoordinate(lat);
  const selectedLng = parseCoordinate(lng);

  const center = useMemo<[number, number]>(() => {
    if (selectedLat !== null && selectedLng !== null) {
      return [selectedLat, selectedLng];
    }

    return [20, 0];
  }, [selectedLat, selectedLng]);

  const zoom = selectedLat !== null && selectedLng !== null ? 13 : 2;
  const googleMapsUrl =
    selectedLat !== null && selectedLng !== null
      ? `https://www.google.com/maps?q=${selectedLat},${selectedLng}`
      : 'https://www.google.com/maps';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] p-4 sm:p-6 flex items-end sm:items-center justify-center">
      <div className="card-field w-full max-w-3xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest font-bold">Pick on Map</div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest">
              Click anywhere on the map to set latitude and longitude.
            </p>
          </div>
          <button onClick={onClose} className="btn-brutalist px-3 py-1 text-xs">
            Close
          </button>
        </div>

        <div className="divider-thick" />

        <div className="overflow-hidden border-2 border-black bg-zinc-100">
          <LeafletMapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom
            zoomControl={false}
            attributionControl={false}
            className="h-[320px] w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapCenterSync center={center} />
            <MapClickHandler
              onPick={(nextLat, nextLng) => {
                onPick(nextLat.toFixed(6), nextLng.toFixed(6));
              }}
            />
            {selectedLat !== null && selectedLng !== null && (
              <LeafletCircleMarker
                center={[selectedLat, selectedLng]}
                radius={10}
                pathOptions={{ color: '#ea580c', fillColor: '#ea580c', fillOpacity: 0.25, weight: 2 }}
              />
            )}
          </LeafletMapContainer>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs uppercase tracking-widest">
          <div className="space-y-1">
            <div className="text-zinc-600 font-bold">Selected Latitude</div>
            <div className="card-field py-2 px-3 font-mono">{selectedLat !== null ? selectedLat.toFixed(6) : 'Not set'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-zinc-600 font-bold">Selected Longitude</div>
            <div className="card-field py-2 px-3 font-mono">{selectedLng !== null ? selectedLng.toFixed(6) : 'Not set'}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center">
          <p className="text-xs text-zinc-600 uppercase tracking-widest">
            After selecting a point, the fields on the form update automatically.
          </p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-brutalist px-3 py-1 text-xs"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
