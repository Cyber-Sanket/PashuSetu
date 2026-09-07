import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { FALLBACK_ANIMALS } from '../../services/fallbackData';
import { Animal } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { PhotoUpload } from '../../components/PhotoUpload';
import {
  PlusCircle,
  Search,
  Filter,
  HeartPulse,
  Syringe,
  Eye,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const SPECIES_BREED_MAP: Record<string, string[]> = {
  Cow: [
    'Gir (गीर)',
    'Sahiwal (साहिवाल)',
    'Khillari (खिलार)',
    'Dangi (डांगी)',
    'Deoni (देवणी)',
    'Red Sindhi (लाल सिंधी)',
    'HF Crossbred (होल्स्टीन संकर)',
    'Jersey Cross (जर्सी संकर)',
    'Gaolao (गौळाऊ)',
    'Tharparkar (थारपारकर)',
    'Other / Unknown',
  ],
  Buffalo: [
    'Murrah (मुऱ्हा)',
    'Pandharpuri (पंढरपुरी)',
    'Jaffarabadi (जाफराबादी)',
    'Mehsana (मेहसाणा)',
    'Nagpuri (नागपुरी)',
    'Surti (सुरती)',
    'Bhadawari (भदावरी)',
    'Marathwadi (मराठवाडी)',
    'Other / Unknown',
  ],
  Goat: [
    'Osmanabadi (उस्मानाबादी)',
    'Sangamneri (संगमनेरी)',
    'Berari (बेरारी)',
    'Sirohi (सिरोही)',
    'Barbari (बरबरी)',
    'Jamunapari (जमुनापारी)',
    'Boer (बोअर)',
    'Konkan Kanyal (कोकण कन्याळ)',
    'Other / Unknown',
  ],
  Sheep: [
    'Deccani (दख्खनी)',
    'Madgyal (माडग्याळ)',
    'Nellore (नेल्लोर)',
    'Marwari (मारवाडी)',
    'Rambouillet Cross (रॅम्ब्युलेट संकर)',
    'Patanwadi (पाटणवाडी)',
    'Other / Unknown',
  ],
  Poultry: [
    'Kadaknath (कडकनाथ)',
    'Aseel (असील)',
    'Giriraja (गिरीराजा)',
    'Vanaraja (वनराजा)',
    'Gramapriya (ग्रामप्रिया)',
    'Commercial Broiler (ब्रॉयलर)',
    'Commercial Layer (लेयर)',
    'Other / Unknown',
  ],
  Other: ['Other / Unknown'],
};

export const MyLivestockPage: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    customBreed: '',
    gender: 'Female',
    ageYears: '3.0',
    weightKg: '350',
    color: 'Reddish Brown',
    identificationNumber: '',
    photoUrl: '',
  });

  const speciesList = ['ALL', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Poultry', 'Other'];

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const data = await DataService.getAnimals(
        selectedSpecies !== 'ALL' ? selectedSpecies : undefined,
        searchQuery || undefined
      );
      setAnimals(data);
    } catch (err) {
      console.error('Failed to load livestock:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [selectedSpecies]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnimals();
  };

  const handleSpeciesChange = (species: string) => {
    setFormData((prev) => ({
      ...prev,
      species,
      breed: '', // Reset breed when species changes
      customBreed: '',
    }));
  };

  const handleAddAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    if (!formData.species) {
      setModalError('Please select a species first before choosing breed.');
      setSubmitting(false);
      return;
    }

    if (!formData.breed) {
      setModalError('Please select a breed.');
      setSubmitting(false);
      return;
    }

    const finalBreed =
      formData.breed === 'Other / Unknown'
        ? formData.customBreed.trim() || 'Other / Unknown'
        : formData.breed;

    try {
      await api.post('/animals', {
        ...formData,
        breed: finalBreed,
      });
      setIsAddModalOpen(false);
      // Reset form
      setFormData({
        name: '',
        species: '',
        breed: '',
        customBreed: '',
        gender: 'Female',
        ageYears: '3.0',
        weightKg: '350',
        color: 'Reddish Brown',
        identificationNumber: '',
        photoUrl: '',
      });
      fetchAnimals();
    } catch (err: any) {
      // Offline / fallback addition
      if (!err.response) {
        const newDemoAnimal: Animal = {
          id: `local-animal-${Date.now()}`,
          farmerId: 'fp-01',
          animalCode: `PS-${formData.species.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
          name: formData.name,
          species: formData.species,
          breed: finalBreed,
          gender: formData.gender,
          ageYears: parseFloat(formData.ageYears) || 3,
          weightKg: parseFloat(formData.weightKg) || 350,
          color: formData.color,
          identificationNumber: formData.identificationNumber || `TAG-MH-${Math.floor(100000 + Math.random() * 900000)}`,
          healthStatus: 'HEALTHY',
          photoUrl: formData.photoUrl,
          village: 'Uruli Kanchan',
          block: 'Haveli',
          district: 'Pune',
          createdAt: new Date().toISOString(),
        };
        FALLBACK_ANIMALS.unshift(newDemoAnimal);
        setAnimals((prev) => [newDemoAnimal, ...prev]);
        setIsAddModalOpen(false);
        return;
      }
      setModalError(err.response?.data?.error || 'Failed to add animal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            My Livestock / माझे पशुधन
          </h1>
          <p className="text-xs text-slate-500">
            Registered livestock roster with digital health tags and vaccination records
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Animal (पशू जोडा)</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Species Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {speciesList.map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSpecies(sp)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
                selectedSpecies === sp
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sp === 'ALL' ? 'All Species' : sp}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search Ear Tag, Name, Breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Livestock Roster Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading livestock roster...</div>
      ) : animals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No livestock found matching criteria.</p>
          <p className="text-xs text-slate-500">Register your cattle, buffalo, or goats to start monitoring their health.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add First Livestock</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  {animal.photoUrl ? (
                    <img
                      src={animal.photoUrl}
                      alt={animal.name || animal.animalCode}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700">
                      {animal.species === 'Cow' ? '🐄' : animal.species === 'Buffalo' ? '🐃' : animal.species === 'Goat' ? '🐐' : '🐾'}
                    </div>
                  )}

                  {/* Status Badge Over Image */}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={animal.healthStatus} />
                  </div>

                  {/* Ear Tag Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    {animal.identificationNumber || animal.animalCode}
                  </div>
                </div>

                {/* Body details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                      {animal.name || animal.animalCode}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {animal.species}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                    <p><strong>Breed:</strong> {animal.breed}</p>
                    <p><strong>Gender:</strong> {animal.gender}</p>
                    <p><strong>Age:</strong> {animal.ageYears} Years</p>
                    <p><strong>Weight:</strong> {animal.weightKg ? `${animal.weightKg} kg` : 'N/A'}</p>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    Location: {animal.village}, {animal.district}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/farmer/report-symptoms?animalId=${animal.id}`}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Report Symptom</span>
                </Link>

                <Link
                  to={`/farmer/livestock/${animal.id}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Medical Record</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Animal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Livestock (नवीन जनावर नोंदवा)"
        maxWidth="lg"
      >
        {modalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{modalError}</span>
          </div>
        )}

        <form onSubmit={handleAddAnimal} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Animal Name (नाव)
              </label>
              <input
                type="text"
                placeholder="e.g. Gauri / लक्ष्मी"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Species (प्रजाती) *
              </label>
              <select
                value={formData.species}
                onChange={(e) => handleSpeciesChange(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">— Select Species First (प्रजाती निवडा) —</option>
                <option value="Cow">Cow (गाय)</option>
                <option value="Buffalo">Buffalo (म्हैस)</option>
                <option value="Goat">Goat (शेळी)</option>
                <option value="Sheep">Sheep (मेंढी)</option>
                <option value="Poultry">Poultry (कुक्कुटपालन)</option>
                <option value="Other">Other (इतर)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Breed (जात) *
              </label>
              <select
                disabled={!formData.species}
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className={`w-full text-xs px-3 py-2 border rounded-xl outline-none font-medium transition-colors ${
                  !formData.species
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-50 border-slate-300 focus:ring-2 focus:ring-emerald-500'
                }`}
                required
              >
                {!formData.species ? (
                  <option value="">— Select Species First —</option>
                ) : (
                  <>
                    <option value="">— Select Breed (जात निवडा) —</option>
                    {(SPECIES_BREED_MAP[formData.species] || ['Other / Unknown']).map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {!formData.species && (
                <p className="text-[10px] text-amber-600 mt-1 font-medium">
                  ⚠️ Please choose a species above to view available breeds.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Gender (लिंग) *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
              >
                <option value="Female">Female (मादी)</option>
                <option value="Male">Male (नर)</option>
              </select>
            </div>
          </div>

          {/* Conditional Custom Breed Input for Other / Unknown */}
          {formData.breed === 'Other / Unknown' && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 animate-fadeIn">
              <label className="block text-xs font-bold text-amber-900 uppercase">
                Specify Custom Breed / इतर जात नमूद करा *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Non-descript local cross, Malvi, Pandharpuri mix..."
                value={formData.customBreed}
                onChange={(e) => setFormData({ ...formData, customBreed: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Age in Years *
              </label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="e.g. 3.5"
                value={formData.ageYears}
                onChange={(e) => setFormData({ ...formData, ageYears: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                placeholder="e.g. 380"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Ear Tag ID / बिल्ला
              </label>
              <input
                type="text"
                placeholder="e.g. TAG-MH-829101"
                value={formData.identificationNumber}
                onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono"
              />
            </div>
          </div>

          {/* Photo Upload Component */}
          <div className="pt-1">
            <PhotoUpload
              value={formData.photoUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, photoUrl: url }))}
              label="Livestock Photo (जनावराचा फोटो - ऐच्छिक)"
              helperText="Capture with mobile camera or upload from gallery (JPEG, PNG, WebP ≤ 5MB)"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Register Livestock'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
