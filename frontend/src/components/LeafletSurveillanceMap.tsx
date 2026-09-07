import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Outbreak } from '../types';
import { RiskBadge } from './RiskBadge';
import { StatusBadge } from './StatusBadge';
import { AlertTriangle, MapPin, Activity, Flame, ShieldCheck } from 'lucide-react';

// Custom Map Marker Icons using SVGs
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

interface LeafletSurveillanceMapProps {
  outbreaks?: Outbreak[];
  reports?: any[];
  districtLayers?: any[];
  height?: string;
  selectedDistrict?: string;
  onDistrictSelect?: (district: string) => void;
}

export const LeafletSurveillanceMap: React.FC<LeafletSurveillanceMapProps> = ({
  outbreaks = [],
  reports = [],
  districtLayers = [],
  height = '500px',
  selectedDistrict = 'ALL',
  onDistrictSelect,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.5204, 74.1332]); // Maharashtra / Pune center
  const [zoomLevel, setZoomLevel] = useState(8);

  const districts = ['ALL', 'Pune', 'Satara', 'Ahmednagar', 'Nashik', 'Kolhapur', 'Solapur'];

  const filteredOutbreaks = outbreaks.filter((o) =>
    selectedDistrict === 'ALL' ? true : o.district.toLowerCase() === selectedDistrict.toLowerCase()
  );

  const filteredReports = reports.filter((r) =>
    selectedDistrict === 'ALL' ? true : r.district.toLowerCase() === selectedDistrict.toLowerCase()
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header controls & filters */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Geospatial Disease Surveillance Map (GIS)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time disease hotspots, cluster outbreaks, and active surveillance radius across Maharashtra
          </p>
        </div>

        {/* District Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1">District:</span>
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => onDistrictSelect && onDistrictSelect(d)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedDistrict === d
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height }} className="relative w-full">
        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Outbreak Clusters with Pulsing Circle Markers */}
          {filteredOutbreaks.map((outbreak) => {
            const isCritical = outbreak.riskLevel === 'CRITICAL';
            const circleColor = isCritical ? '#dc2626' : '#ea580c';
            const radius = isCritical ? 24 : 18;

            return (
              <React.Fragment key={outbreak.id}>
                <CircleMarker
                  center={[outbreak.latitude, outbreak.longitude]}
                  radius={radius}
                  pathOptions={{
                    color: circleColor,
                    fillColor: circleColor,
                    fillOpacity: 0.35,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px]">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-sm">
                          🚨 {outbreak.village} Outbreak
                        </span>
                        <RiskBadge level={outbreak.riskLevel} size="sm" />
                      </div>
                      <div className="text-xs space-y-1 text-slate-600">
                        <p><strong className="text-slate-800">Disease:</strong> {outbreak.suspectedDisease}</p>
                        <p><strong className="text-slate-800">Location:</strong> {outbreak.village}, {outbreak.block}, {outbreak.district}</p>
                        <p><strong className="text-slate-800">Reported Cases:</strong> <span className="text-red-600 font-bold">{outbreak.caseCount}</span> (Deaths: {outbreak.deathCount})</p>
                        <p><strong className="text-slate-800">Status:</strong> <StatusBadge status={outbreak.status} /></p>
                        {outbreak.assignedTeam && (
                          <p className="text-[11px] text-blue-700 bg-blue-50 p-1 rounded mt-1">
                            Team: {outbreak.assignedTeam}
                          </p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
                <Marker
                  position={[outbreak.latitude, outbreak.longitude]}
                  icon={createCustomIcon(circleColor)}
                />
              </React.Fragment>
            );
          })}

          {/* Individual High-Risk Reported Cases */}
          {filteredReports.map((rep) => {
            if (!rep.latitude || !rep.longitude) return null;
            const markerColor = rep.riskLevel === 'CRITICAL' ? '#ef4444' : rep.riskLevel === 'HIGH' ? '#f97316' : '#10b981';

            return (
              <Marker
                key={rep.id}
                position={[rep.latitude, rep.longitude]}
                icon={createCustomIcon(markerColor)}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <p className="font-bold text-slate-900 mb-1">{rep.reportCode}</p>
                    <p className="text-slate-600">Species: {rep.animal?.species || 'Livestock'}</p>
                    <p className="text-slate-600">Location: {rep.village}, {rep.district}</p>
                    <div className="mt-1">
                      <RiskBadge level={rep.riskLevel} score={rep.riskScore} size="sm" />
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-lg z-[1000] text-xs">
          <p className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Epidemiological Risk Legend
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-200 inline-block" />
              <span className="text-slate-700 font-medium">Critical Outbreak Cluster</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-200 inline-block" />
              <span className="text-slate-700 font-medium">High Risk Area / 5+ Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200 inline-block" />
              <span className="text-slate-700 font-medium">Low / Controlled Surveillance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
