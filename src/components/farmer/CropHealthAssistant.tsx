import React, { useState } from 'react';
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  PhoneCall,
  RefreshCw,
  ShieldAlert,
  Camera,
  Layers,
  FileCheck,
} from 'lucide-react';
import { UserProfile, CropHealthCheck } from '../../types';
import { requestCropHealthCheck } from '../../services/aiService';
import { farmStore } from '../../services/store';

interface CropHealthAssistantProps {
  currentUser: UserProfile;
}

export const CropHealthAssistant: React.FC<CropHealthAssistantProps> = ({ currentUser }) => {
  const [cropName, setCropName] = useState('Cotton (Bt Hybrid)');
  const [cropStage, setCropStage] = useState<CropHealthCheck['cropStage']>('Vegetative');
  const [affectedPart, setAffectedPart] = useState<CropHealthCheck['affectedPart']>('Leaves');
  const [symptoms, setSymptoms] = useState('Upward leaf curling, yellowing along veins, and slight stunting of new flush');
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropHealthCheck | null>(null);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disclaimerChecked) {
      alert('Please acknowledge that this is a preliminary screening, not a confirmed laboratory diagnosis.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestCropHealthCheck({
        cropName,
        cropStage,
        symptoms,
        affectedPart,
        imageBase64: imagePreview || undefined,
      });

      const check: CropHealthCheck = {
        id: `chk_${Date.now()}`,
        farmerId: currentUser.id,
        cropName,
        cropStage,
        symptoms,
        affectedPart,
        possibleDiseaseOrPest: res.data.possibleDiseaseOrPest,
        confidenceTier: res.data.confidenceTier,
        diagnosisExplanation: res.data.diagnosisExplanation,
        preventiveMeasures: res.data.preventiveMeasures,
        curativeOrganicTreatments: res.data.curativeOrganicTreatments,
        recommendedAgronomicAdvice: res.data.recommendedAgronomicAdvice,
        isDisclaimerAcknowledged: true,
        imageUrl: imagePreview || undefined,
        createdAt: new Date().toISOString(),
      };

      setResult(check);
      farmStore.saveHealthCheck(check);
    } catch (err) {
      console.error('Diagnosis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Plant Pathology Screening Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Crop Health & Disease Diagnostic Screening
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Upload leaf/crop imagery and describe symptoms to receive preliminary pest identification, bio-control solutions, and extension guidance.
        </p>
      </div>

      {/* Mandatory Non-Diagnostic Uncertainty Warning */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block text-amber-950 font-bold">Important Diagnostic Boundary & Uncertainty Disclosure:</strong>
          <span>
            Digital image screening indicates <em>probable symptoms</em>, not a certified microbiological laboratory culture. Never apply restricted chemical pesticides based on AI screening alone without consulting your local Mandal Agricultural Officer or Krishi Vigyan Kendra (KVK).
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input & Image Upload (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3">
            Symptom & Image Submission
          </h2>

          <form onSubmit={handleDiagnose} className="space-y-4">
            {/* Image Preview Box */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Plant / Leaf Photograph
              </label>
              <div className="relative rounded-xl border-2 border-dashed border-stone-300 overflow-hidden bg-stone-50 h-52 flex items-center justify-center group">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Crop symptom"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <label className="px-3 py-1.5 rounded-lg bg-white text-stone-900 font-semibold text-xs cursor-pointer shadow-md">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                    <Camera className="w-8 h-8 text-stone-400 mb-2" />
                    <span className="text-xs font-semibold text-emerald-700">Upload plant photograph</span>
                    <span className="text-[11px] text-stone-400 mt-1">High-resolution close-up of leaf or stem</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Growth Stage
                </label>
                <select
                  value={cropStage}
                  onChange={(e) => setCropStage(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="Seedling">Seedling</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Fruiting">Fruiting / Podding</option>
                  <option value="Maturity">Maturity / Harvest</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Affected Plant Anatomy
              </label>
              <select
                value={affectedPart}
                onChange={(e) => setAffectedPart(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="Leaves">Leaves & Foliage</option>
                <option value="Stem">Stem / Collar</option>
                <option value="Root">Root System</option>
                <option value="Fruit / Grain">Fruit / Grain / Pods</option>
                <option value="Whole Plant">Whole Plant Stunting / Wilting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Observed Symptoms in Field
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                placeholder="Describe leaf spots, color changes, holes, sticky secretions, or insects visible under the leaves..."
                required
              />
            </div>

            {/* Mandatory Disclaimer Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="disclaimer-chk"
                type="checkbox"
                checked={disclaimerChecked}
                onChange={(e) => setDisclaimerChecked(e.target.checked)}
                className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
                required
              />
              <label htmlFor="disclaimer-chk" className="text-[11px] text-stone-600 leading-tight cursor-pointer">
                I understand this is an AI advisory screening tool, not a certified lab diagnosis. I will verify with an agricultural extension officer before using chemical sprays.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !disclaimerChecked}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Screening Pathology Database...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Analyze Symptoms & Recommend Organic Shield</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Diagnosis & Remedial Action (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Preliminary Screening Result
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 mt-1">
                    {result.possibleDiseaseOrPest}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Host: {result.cropName} ({result.cropStage} stage) • Part: {result.affectedPart}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                  {result.confidenceTier}
                </span>
              </div>

              {/* Explanation */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <strong className="text-stone-900 block mb-1">Pathological Rationale:</strong>
                {result.diagnosisExplanation}
              </div>

              {/* Organic & Biological Controls */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Immediate Organic & Bio-Control Steps</span>
                </h4>
                <div className="space-y-2">
                  {result.curativeOrganicTreatments.map((treatment, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                      {treatment}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preventative Cultural Practices */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Preventive Cultural Measures
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {result.preventiveMeasures.map((measure, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Extension & Expert Contact Referral */}
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
                  <PhoneCall className="w-4 h-4 text-sky-700" />
                  <span>Official Agricultural Extension Referral</span>
                </div>
                <p className="text-xs text-sky-900 leading-relaxed">
                  {result.recommendedAgronomicAdvice}
                </p>
                <div className="pt-2 text-[11px] text-sky-800 flex items-center gap-4">
                  <span>Kisan Call Centre Toll-Free: <strong>1800-180-1551</strong></span>
                  <span>•</span>
                  <span>Working hours: 6 AM to 10 PM</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Camera className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">No Plant Screened Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Submit an affected plant photograph and describe your field symptoms to receive instant bio-control measures and disease screening.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
