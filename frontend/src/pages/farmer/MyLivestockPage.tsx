import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { FALLBACK_ANIMALS } from '../../services/fallbackData';
import { Animal } from '../../types';
import { useLanguage, getSpeciesLabel, getBreedLabel, getLocationLabel, getSpeciesDefaultPhoto } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { PhotoUpload } from '../../components/PhotoUpload';
import {
  PlusCircle,
  Search,
  HeartPulse,
  Eye,
  AlertCircle,
  Camera,
  Edit3,
  Trash2,
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
  const { t, language } = useLanguage();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete Confirmation State
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Photo Update Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoAnimal, setSelectedPhotoAnimal] = useState<Animal | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const handleSavePhoto = async () => {
    if (!selectedPhotoAnimal || !newPhotoUrl) return;
    setIsSavingPhoto(true);
    try {
      await api.patch(`/animals/${selectedPhotoAnimal.id}`, { photoUrl: newPhotoUrl });
    } catch (err) {
      console.warn('API update failed, updating local state:', err);
    }
    setAnimals((prev) =>
      prev.map((a) => (a.id === selectedPhotoAnimal.id ? { ...a, photoUrl: newPhotoUrl } : a))
    );
    setIsSavingPhoto(false);
    setIsPhotoModalOpen(false);
  };

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
    village: '',
    block: '',
    district: '',
  });

  const speciesList = ['ALL', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Poultry', 'Other'];
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchAnimals = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await DataService.getAnimals(
        selectedSpecies !== 'ALL' ? selectedSpecies : undefined,
        searchQuery || undefined
      );
      setAnimals(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load livestock:', err);
      setAnimals([]);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      setLoadError(
        msg ||
          (language === 'mr'
            ? 'पशूंची माहिती मिळवण्यात त्रुटी आली.'
            : language === 'hi'
            ? 'पशु डेटा लोड करने में विफल।'
            : 'Failed to load livestock.')
      );
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

  const handleOpenAddModal = () => {
    setEditingAnimal(null);
    setModalError(null);
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
      village: '',
      block: '',
      district: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (animal: Animal) => {
    setEditingAnimal(animal);
    setModalError(null);
    const knownBreeds = SPECIES_BREED_MAP[animal.species] || [];
    const matchedKnown = knownBreeds.find(
      (b) => b === animal.breed || b.toLowerCase().startsWith(animal.breed.toLowerCase().split(' ')[0])
    );

    setFormData({
      name: animal.name || '',
      species: animal.species || '',
      breed: matchedKnown || (animal.breed ? 'Other / Unknown' : ''),
      customBreed: matchedKnown ? '' : (animal.breed || ''),
      gender: animal.gender || 'Female',
      ageYears: animal.ageYears !== undefined ? String(animal.ageYears) : '3.0',
      weightKg: animal.weightKg !== undefined && animal.weightKg !== null ? String(animal.weightKg) : '',
      color: animal.color || 'Reddish Brown',
      identificationNumber: animal.identificationNumber || '',
      photoUrl: animal.photoUrl || '',
      village: animal.village || '',
      block: animal.block || '',
      district: animal.district || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);

    if (!formData.species) {
      setModalError(t('pleaseSelectSpeciesFirst'));
      setSubmitting(false);
      return;
    }

    if (!formData.breed) {
      setModalError(t('pleaseSelectBreed'));
      setSubmitting(false);
      return;
    }

    const finalBreed =
      formData.breed === 'Other / Unknown'
        ? formData.customBreed.trim() || 'Other / Unknown'
        : formData.breed;

    const payload = {
      name: formData.name.trim(),
      species: formData.species,
      breed: finalBreed,
      gender: formData.gender,
      ageYears: parseFloat(formData.ageYears) || 0,
      weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
      color: formData.color.trim() || undefined,
      identificationNumber: formData.identificationNumber.trim() || undefined,
      photoUrl: formData.photoUrl || undefined,
      village: formData.village.trim() || undefined,
      block: formData.block.trim() || undefined,
      district: formData.district.trim() || undefined,
    };

    try {
      if (editingAnimal) {
        await api.put(`/animals/${editingAnimal.id}`, payload);
      } else {
        await api.post('/animals', payload);
      }
      setIsAddModalOpen(false);
      setEditingAnimal(null);
      fetchAnimals();
    } catch (err: any) {
      // Offline fallback addition
      if (!err.response) {
        if (editingAnimal) {
          setAnimals((prev) =>
            prev.map((a) =>
              a.id === editingAnimal.id
                ? {
                    ...a,
                    ...payload,
                    ageYears: parseFloat(formData.ageYears) || a.ageYears,
                    weightKg: formData.weightKg ? parseFloat(formData.weightKg) : a.weightKg,
                    color: formData.color,
                    village: formData.village || a.village,
                    block: formData.block || a.block,
                    district: formData.district || a.district,
                  }
                : a
            )
          );
          setIsAddModalOpen(false);
          setEditingAnimal(null);
          return;
        } else {
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
            village: formData.village || 'Uruli Kanchan',
            block: formData.block || 'Haveli',
            district: formData.district || 'Pune',
            createdAt: new Date().toISOString(),
          };
          FALLBACK_ANIMALS.unshift(newDemoAnimal);
          setAnimals((prev) => [newDemoAnimal, ...prev]);
          setIsAddModalOpen(false);
          return;
        }
      }
      setModalError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        (editingAnimal
          ? (language === 'mr' ? 'पशू अद्यतनित करण्यात त्रुटी आली.' : 'Failed to update animal')
          : t('failedToAddAnimal'))
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!animalToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await api.delete(`/animals/${animalToDelete.id}`);
      setAnimals((prev) => prev.filter((a) => a.id !== animalToDelete.id));
      setAnimalToDelete(null);
      fetchAnimals();
    } catch (err: any) {
      console.error('Failed to delete animal:', err);
      if (!err.response) {
        setAnimals((prev) => prev.filter((a) => a.id !== animalToDelete.id));
        setAnimalToDelete(null);
        return;
      }
      setDeleteError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        (language === 'mr' ? 'पशू हटवण्यात त्रुटी आली.' : 'Failed to delete animal. Please try again.')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const yearsUnit = language === 'mr' ? 'वर्षे' : language === 'hi' ? 'वर्ष' : 'Years';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            {t('myLivestockTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('myLivestockSubtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('addAnimal')}</span>
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
              {getSpeciesLabel(sp, language)}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Error Alert */}
      {loadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={() => fetchAnimals()}
            className="text-xs font-bold text-red-800 underline hover:no-underline"
          >
            {language === 'mr' ? 'पुन्हा प्रयत्न करा' : language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </button>
        </div>
      )}

      {/* Livestock Roster Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">{t('loadingLivestock')}</div>
      ) : animals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">{t('noLivestockFound')}</p>
          <p className="text-xs text-slate-500">{t('registerToStartMonitoring')}</p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('addFirstLivestock')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {animals.map((animal) => {
            const speciesText = getSpeciesLabel(animal.species, language);
            const genderText = animal.gender === 'Female' ? t('female') : animal.gender === 'Male' ? t('male') : animal.gender;

            return (
              <div
                key={animal.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="h-44 bg-slate-100 relative overflow-hidden group">
                    <img
                      src={animal.photoUrl || getSpeciesDefaultPhoto(animal.species)}
                      alt={animal.name || animal.animalCode}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getSpeciesDefaultPhoto(animal.species);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Badge Over Image */}
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={animal.healthStatus} />
                    </div>

                    {/* Ear Tag Badge */}
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      {animal.identificationNumber || animal.animalCode}
                    </div>

                    {/* Add / Change Photo Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedPhotoAnimal(animal);
                        setNewPhotoUrl(animal.photoUrl || '');
                        setIsPhotoModalOpen(true);
                      }}
                      className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow transition-all hover:scale-105"
                      title={t('addPhoto')}
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{animal.photoUrl ? t('changePhoto') : t('addPhoto')}</span>
                    </button>
                  </div>

                  {/* Body details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                        {animal.name || animal.animalCode}
                      </h3>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {speciesText}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                      <p><strong>{t('breed')}:</strong> {getBreedLabel(animal.breed, language)}</p>
                      <p><strong>{t('gender')}:</strong> {genderText}</p>
                      <p><strong>{t('age')}:</strong> {animal.ageYears} {yearsUnit}</p>
                      <p><strong>{t('weight')}:</strong> {animal.weightKg ? `${animal.weightKg} ${language === 'mr' ? 'कि.ग्रा.' : 'kg'}` : (language === 'mr' ? 'उपलब्ध नाही' : 'N/A')}</p>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      {t('location')}: {getLocationLabel(animal.village, animal.district, language)}
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={`/farmer/report-symptoms?animalId=${animal.id}`}
                      className="flex-1 text-center text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>{t('reportSymptomBtn')}</span>
                    </Link>

                    <Link
                      to={`/farmer/livestock/${animal.id}`}
                      className="flex-1 text-center text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('medicalRecord')}</span>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(animal)}
                      className="flex-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'mr' ? 'संपादित करा' : language === 'hi' ? 'संपादित करें' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAnimalToDelete(animal);
                        setDeleteError(null);
                      }}
                      className="flex-1 text-xs font-bold text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>{language === 'mr' ? 'हटवा' : language === 'hi' ? 'हटाएं' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Animal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAnimal(null);
        }}
        title={
          editingAnimal
            ? language === 'mr'
              ? 'पशू माहिती संपादित करा'
              : language === 'hi'
              ? 'पशु विवरण संपादित करें'
              : 'Edit Livestock Details'
            : t('registerNewLivestock')
        }
        maxWidth="lg"
      >
        {modalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{modalError}</span>
          </div>
        )}

        <form onSubmit={handleSaveAnimal} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('animalName')}
              </label>
              <input
                type="text"
                placeholder={language === 'mr' ? 'उदा. गौरी / लक्ष्मी' : 'e.g. Gauri / Lakshmi'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('species')} *
              </label>
              <select
                value={formData.species}
                onChange={(e) => handleSpeciesChange(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">{t('selectSpeciesFirst')}</option>
                <option value="Cow">{getSpeciesLabel('Cow', language)}</option>
                <option value="Buffalo">{getSpeciesLabel('Buffalo', language)}</option>
                <option value="Goat">{getSpeciesLabel('Goat', language)}</option>
                <option value="Sheep">{getSpeciesLabel('Sheep', language)}</option>
                <option value="Poultry">{getSpeciesLabel('Poultry', language)}</option>
                <option value="Other">{getSpeciesLabel('Other', language)}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('breed')} *
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
                  <option value="">{t('selectSpeciesFirst')}</option>
                ) : (
                  <>
                    <option value="">{t('selectBreed')}</option>
                    {(SPECIES_BREED_MAP[formData.species] || ['Other / Unknown']).map((b) => (
                      <option key={b} value={b}>
                        {getBreedLabel(b, language)}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {!formData.species && (
                <p className="text-[10px] text-amber-600 mt-1 font-medium">
                  {t('chooseSpeciesHint')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('gender')} *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
              >
                <option value="Female">{t('female')}</option>
                <option value="Male">{t('male')}</option>
              </select>
            </div>
          </div>

          {/* Conditional Custom Breed Input for Other / Unknown */}
          {formData.breed === 'Other / Unknown' && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 animate-fadeIn">
              <label className="block text-xs font-bold text-amber-900 uppercase">
                {t('specifyCustomBreed')} *
              </label>
              <input
                type="text"
                required
                placeholder={t('customBreedPlaceholder')}
                value={formData.customBreed}
                onChange={(e) => setFormData({ ...formData, customBreed: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('ageYears')} *
              </label>
              <input
                type="number"
                step="0.1"
                required
                placeholder={language === 'mr' ? 'उदा. ३.५' : 'e.g. 3.5'}
                value={formData.ageYears}
                onChange={(e) => setFormData({ ...formData, ageYears: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('weightKg')}
              </label>
              <input
                type="number"
                placeholder={language === 'mr' ? 'उदा. ३८०' : 'e.g. 380'}
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {language === 'mr' ? 'रंग' : language === 'hi' ? 'रंग' : 'Color'}
              </label>
              <input
                type="text"
                placeholder={language === 'mr' ? 'उदा. लालसर तपकिरी' : 'e.g. Reddish Brown'}
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('earTagId')}
              </label>
              <input
                type="text"
                placeholder={language === 'mr' ? 'उदा. TAG-MH-829101' : 'e.g. TAG-MH-829101'}
                value={formData.identificationNumber}
                onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {language === 'mr' ? 'गाव' : language === 'hi' ? 'गाँव' : 'Village'}
              </label>
              <input
                type="text"
                placeholder={language === 'mr' ? 'उदा. उरुळी कांचन' : 'e.g. Uruli Kanchan'}
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {language === 'mr' ? 'तालुका / ब्लॉक' : language === 'hi' ? 'ब्लॉक' : 'Block / Taluka'}
              </label>
              <input
                type="text"
                placeholder={language === 'mr' ? 'उदा. हवेली' : 'e.g. Haveli'}
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('district')}
              </label>
              <input
                type="text"
                placeholder={language === 'mr' ? 'उदा. पुणे' : 'e.g. Pune'}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Photo Upload Component */}
          <div className="pt-1">
            <PhotoUpload
              value={formData.photoUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, photoUrl: url }))}
              label={t('livestockPhoto')}
              helperText={t('photoUploadHelper')}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingAnimal(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors disabled:opacity-50"
            >
              {submitting
                ? t('saving')
                : editingAnimal
                ? language === 'mr'
                  ? 'बदल जतन करा'
                  : language === 'hi'
                  ? 'परिवर्तन सहेजें'
                  : 'Save Changes'
                : t('registerLivestockBtn')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit / Add Animal Photo Modal */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title={selectedPhotoAnimal?.photoUrl ? t('changePhoto') : t('addPhoto')}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <p className="font-bold text-slate-900">
              {selectedPhotoAnimal?.name || selectedPhotoAnimal?.animalCode}
            </p>
            <p className="text-slate-500 text-[11px]">
              {t('earTagId')}: <span className="font-mono font-bold text-slate-700">{selectedPhotoAnimal?.identificationNumber || selectedPhotoAnimal?.animalCode}</span>
            </p>
          </div>

          <PhotoUpload
            value={newPhotoUrl}
            onChange={(url) => setNewPhotoUrl(url)}
            label={t('livestockPhoto')}
            helperText={t('photoUploadHelper')}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              onClick={handleSavePhoto}
              disabled={!newPhotoUrl || isSavingPhoto}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors disabled:opacity-50"
            >
              {isSavingPhoto ? t('saving') : t('save')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(animalToDelete)}
        onClose={() => {
          if (!isDeleting) {
            setAnimalToDelete(null);
            setDeleteError(null);
          }
        }}
        title={language === 'mr' ? 'पशू हटवण्याची पुष्टी करा' : language === 'hi' ? 'पशु हटाने की पुष्टि करें' : 'Confirm Animal Deletion'}
        maxWidth="sm"
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-red-900 text-sm font-['Outfit']">
                {animalToDelete?.name || animalToDelete?.animalCode}
              </p>
              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to delete this animal? This action cannot be undone.
              </p>
              {animalToDelete?.identificationNumber && (
                <p className="text-[11px] font-mono text-slate-500">
                  {t('earTagId')}: <span className="font-bold text-slate-700">{animalToDelete.identificationNumber}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => {
                setAnimalToDelete(null);
                setDeleteError(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>
                {isDeleting
                  ? language === 'mr'
                    ? 'हटवत आहे...'
                    : language === 'hi'
                    ? 'हटाया जा रहा है...'
                    : 'Deleting...'
                  : language === 'mr'
                  ? 'हटवा'
                  : language === 'hi'
                  ? 'हटाएं'
                  : 'Delete Animal'}
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
