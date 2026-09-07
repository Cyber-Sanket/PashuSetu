import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { LeafletSurveillanceMap } from '../../components/LeafletSurveillanceMap';

export const SurveillanceMapPage: React.FC = () => {
  const [gisData, setGisData] = useState<{ outbreaks: any[]; reports: any[]; districtLayers: any[] }>({
    outbreaks: [],
    reports: [],
    districtLayers: [],
  });
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getGovtGis()
      .then((data) => setGisData(data))
      .catch((err) => console.error('Failed to load GIS data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Interactive GIS Disease Surveillance Map / भौगोलिक रोग पाळत
        </h1>
        <p className="text-xs text-slate-500">
          Statewide real-time geospatial epidemiology mapping active disease clusters, reported cases, and district vulnerability
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading geospatial data layers...</div>
      ) : (
        <LeafletSurveillanceMap
          outbreaks={gisData.outbreaks}
          reports={gisData.reports}
          districtLayers={gisData.districtLayers}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={(d) => setSelectedDistrict(d)}
          height="650px"
        />
      )}
    </div>
  );
};
