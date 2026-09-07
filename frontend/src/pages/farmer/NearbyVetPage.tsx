import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { VetServiceLocation } from '../../types';
import { Building2, PhoneCall, MapPin, Clock, Stethoscope, ShieldCheck } from 'lucide-react';

export const NearbyVetPage: React.FC = () => {
  const [facilities, setFacilities] = useState<VetServiceLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const districts = ['ALL', 'Pune', 'Satara', 'Ahmednagar'];

  useEffect(() => {
    DataService.getNearbyVets(districtFilter)
      .then((data) => setFacilities(data))
      .catch((err) => console.error('Failed to load vet facilities:', err))
      .finally(() => setLoading(false));
  }, [districtFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            Nearby Veterinary Facilities / पशुवैद्यकीय दवाखाने
          </h1>
          <p className="text-xs text-slate-500">
            Government veterinary polyclinics, taluka dispensaries, and mobile health units in Maharashtra
          </p>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setDistrictFilter(d)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
                districtFilter === d
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 24x7 Helpline Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0">
            📞
          </div>
          <div>
            <h3 className="font-bold text-base font-['Outfit']">Maharashtra Animal Disease Helpline: 1962</h3>
            <p className="text-xs text-slate-300">Call toll-free for dispatching Mobile Veterinary Units (MVU) directly to your farm.</p>
          </div>
        </div>
        <a
          href="tel:1962"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl shadow shrink-0 transition-colors"
        >
          Call 1962 Now
        </a>
      </div>

      {/* Facilities Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading veterinary centers...</div>
      ) : facilities.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          No facilities found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {fac.type}
                  </span>
                  <span className="text-xs text-slate-400">{fac.district}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">{fac.name}</h3>

                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{fac.address}</span>
                </p>

                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>In-Charge: <strong>{fac.doctorInCharge}</strong></span>
                </p>

                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Hours: {fac.operatingHours}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-800">{fac.contactPhone}</span>
                <a
                  href={`tel:${fac.contactPhone}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Contact Clinic</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
