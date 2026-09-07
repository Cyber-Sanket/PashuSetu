import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { LeafletSurveillanceMap } from '../../components/LeafletSurveillanceMap';
import { MapPin, Activity, Flame, ShieldCheck } from 'lucide-react';

export const VetSurveillanceMapPage: React.FC = () => {
  const [gisData, setGisData] = useState<{ outbreaks: any[]; reports: any[] }>({
    outbreaks: [],
    reports: [],
  });
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
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
          Field Disease Surveillance Map / रोग पाळत नकाशा
        </h1>
        <p className="text-xs text-slate-500">
          Geographic visualization of local symptom clusters, confirmed outbreaks, and farmstead risk zones
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading geospatial data...</div>
      ) : (
        <LeafletSurveillanceMap
          outbreaks={gisData.outbreaks}
          reports={gisData.reports}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={(d) => setSelectedDistrict(d)}
          height="600px"
        />
      )}
    </div>
  );
};
