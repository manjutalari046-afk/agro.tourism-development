export type UserRole = 'farmer' | 'tourist' | 'community_manager' | 'administrator';

export type Language = 'en' | 'te';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location: string;
  state: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SoilMetrics {
  ph: number;
  nitrogenKgHa: number; // N in kg/ha
  phosphorusKgHa: number; // P in kg/ha
  potassiumKgHa: number; // K in kg/ha
  organicCarbonPercent: number; // OC in %
  electricalConductivityDsM: number; // EC in dS/m
  sulfurPpm?: number;
  zincPpm?: number;
  ironPpm?: number;
  boronPpm?: number;
}

export interface SoilAnalysisReport {
  id: string;
  farmerId: string;
  farmName: string;
  location: string;
  soilType: 'Alluvial' | 'Black (Regur)' | 'Red & Yellow' | 'Laterite' | 'Sandy Loam' | 'Clay Loam';
  irrigationType: 'Borewell / Tube well' | 'Canal' | 'Drip Irrigation' | 'Sprinkler' | 'Rainfed';
  currentCrop?: string;
  testedAt: string;
  metrics: Partial<SoilMetrics>;
  missingMetrics: string[];
  phCategory: 'Acidic' | 'Neutral' | 'Alkaline';
  nitrogenStatus: 'Low' | 'Medium' | 'High';
  phosphorusStatus: 'Low' | 'Medium' | 'High';
  potassiumStatus: 'Low' | 'Medium' | 'High';
  recommendations: {
    fertilizerDose: string[];
    organicAmendments: string[];
    irrigationAdvice: string;
    caution: string;
  };
  aiExplanation?: string;
  documentFileName?: string;
}

export interface CropOption {
  id: string;
  name: string;
  teluguName: string;
  category: 'Cereal' | 'Pulse' | 'Oilseed' | 'Cash Crop' | 'Horticulture / Fruit' | 'Vegetable' | 'Spices';
  suitabilityScore: number; // 0 - 100
  suitabilityTier: 'Highly Suitable' | 'Moderately Suitable' | 'Marginal';
  reasons: string[];
  growingConditions: string;
  waterRequirementMm: string;
  waterLevel: 'Low' | 'Medium' | 'High';
  cropDurationDays: string;
  estimatedCostPerAcre: number;
  expectedYieldPerAcre: string;
  marketDemand: 'High' | 'Moderate' | 'Seasonal';
  risksAndConstraints: string[];
  nextSteps: string[];
  isLegume?: boolean;
}

export interface CropRotationPlan {
  id: string;
  farmerId: string;
  plotName: string;
  currentCrop: string;
  nextCrop: string;
  rotationSeason: 'Kharif' | 'Rabi' | 'Zaid';
  nitrogenBenefit: string;
  soilHealthScore: number; // 1-10
  pestBreakingEffect: string;
  irrigationFeasibility: string;
  legumeOptionRecommended: string;
  cautions: string[];
  createdAt: string;
}

export interface CropHealthCheck {
  id: string;
  farmerId: string;
  cropName: string;
  cropStage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturity';
  symptoms: string;
  affectedPart: 'Leaves' | 'Stem' | 'Root' | 'Fruit / Grain' | 'Whole Plant';
  possibleDiseaseOrPest: string;
  confidenceTier: 'Probable (AI Screening)' | 'Under Investigation' | 'Requires Lab Confirmation';
  diagnosisExplanation: string;
  preventiveMeasures: string[];
  curativeOrganicTreatments: string[];
  recommendedAgronomicAdvice: string;
  isDisclaimerAcknowledged: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface CropCostItem {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers & Nutrients' | 'Crop Protection' | 'Labour' | 'Irrigation & Power' | 'Machinery & Fuel' | 'Harvesting & Transport';
  amount: number;
}

export interface CropProfitEstimate {
  id: string;
  farmerId: string;
  cropName: string;
  cultivatedAreaAcres: number;
  expenses: CropCostItem[];
  totalEstimatedCost: number;
  costPerAcre: number;
  expectedYieldQuintalsPerAcre: number;
  totalExpectedYieldQuintals: number;
  expectedSellingPricePerQuintal: number;
  estimatedGrossRevenue: number;
  estimatedNetReturn: number;
  breakEvenPricePerQuintal: number;
  breakEvenYieldQuintals: number;
  returnOnInvestmentPct: number;
  savedAt: string;
}

export interface MarketObservation {
  id: string;
  commodity: string;
  variety: string;
  mandiName: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceUnit: '₹/Quintal' | '₹/Kg';
  priceChange24h: number; // percentage
  observationDate: string;
  dataSource: string;
  isLiveOrVerified: boolean;
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  contactPhone: string;
  productName: string;
  category: 'Organic Fruits' | 'Fresh Vegetables' | 'Heritage Grains & Millets' | 'Pulses' | 'Cold-Pressed Oils' | 'Spices & Herbs' | 'Dairy & Honey';
  quantityAvailable: number;
  unit: 'Kg' | 'Quintal' | 'Box (10kg)' | 'Litre';
  pricePerUnit: number;
  harvestDate: string;
  pickupAddress: string;
  deliveryAvailable: boolean;
  organicCertified: boolean;
  description: string;
  status: 'Available' | 'Low Stock' | 'Sold Out';
  imageUrl: string;
  createdAt: string;
}

export interface ProduceEnquiry {
  id: string;
  produceId: string;
  productName: string;
  farmerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  requestedQuantity: number;
  unit: string;
  message: string;
  status: 'Pending' | 'Contacted' | 'Fulfilled' | 'Cancelled';
  createdAt: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  teluguName?: string;
  category: 'Direct Income Support' | 'Crop Insurance' | 'Soil & Inputs' | 'Irrigation & Water' | 'Agritourism & Rural Infra' | 'Mechanization' | 'Organic Farming';
  description: string;
  potentialBenefits: string;
  eligibilityConditions: string[];
  applicableRegions: string[];
  maxLandHoldingHa?: number;
  requiredDocuments: string[];
  applicationProcedure: string;
  officialSourceLink: string;
  lastVerifiedDate: string;
  isActive: boolean;
}

export type ReadinessState = 'Eligible for recommendation' | 'Awaiting verification' | 'Improvement required';

export interface ReadinessCriterion {
  id: string;
  title: string;
  category: 'Legal & Permissions' | 'Safety & First Aid' | 'Accommodation Standard' | 'Sanitation & Drinking Water' | 'Visitor Experiences' | 'Environmental Responsibility';
  isMandatory: boolean;
  description: string;
  verificationMethod: 'Document Audit' | 'Physical Inspection' | 'Photographic Evidence' | 'Local Official Sign-off';
  regulatorySource: string;
}

export interface FarmStayCriterionEvaluation {
  criterionId: string;
  satisfied: boolean;
  evidenceNotes?: string;
  evidenceUrl?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  status: 'Satisfied' | 'Evidence Missing' | 'Under Review' | 'Failed';
}

export interface FarmStayActivity {
  id: string;
  title: string;
  category: 'Harvesting & Fruit Picking' | 'Milking & Dairy' | 'Traditional Cooking' | 'Pottery & Crafts' | 'Guided Nature Walk' | 'Bullock Cart / Tractor Ride';
  description: string;
  durationMinutes: number;
  pricePerPerson: number;
  capacity: number;
  seasonalMonths: string[];
  safetyNotes: string;
  minAgeYears: number;
}

export interface FarmStayListing {
  id: string;
  farmerId: string;
  farmName: string;
  tagline: string;
  location: string;
  district: string;
  state: string;
  farmType: string;
  farmSizeAcres: number;
  description: string;
  operatorName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Accommodation
  accommodationType: 'Eco Cottage' | 'Traditional Farmhouse' | 'Heritage Hut' | 'Tents & Camping';
  totalRooms: number;
  maxGuestCapacity: number;
  pricePerNight: number;
  
  // Facilities & Essentials
  drinkingWaterTested: boolean;
  waterSourceDescription: string;
  sanitationDetails: string;
  visitorSafetyMeasures: string[];
  wasteManagement: string;
  roadAccessQuality: 'All-weather paved' | 'Good gravel road' | 'Narrow dirt track (4WD suggested)';
  hasFirstAid: boolean;
  hasEmergencyContact: boolean;
  
  // Tourism highlights
  activities: FarmStayActivity[];
  seasonalOpenMonths: string[];
  photos: string[];
  
  // Verification & Readiness
  readinessState: ReadinessState;
  criterionEvaluations: Record<string, FarmStayCriterionEvaluation>;
  verificationDate?: string;
  verifiedByAdminId?: string;
  verificationNotes?: string;
  
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FarmImprovementItem {
  id: string;
  farmStayId: string;
  criterionId: string;
  problemIdentified: string;
  whyItMatters: string;
  isMandatory: boolean;
  suggestedAction: string;
  responsibleParty: string;
  status: 'Not Started' | 'In Progress' | 'Evidence Submitted' | 'Verified Done';
  evidenceSubmittedNotes?: string;
}

export interface TouristEnquiry {
  id: string;
  farmStayId: string;
  farmName: string;
  farmerId: string;
  touristName: string;
  touristEmail: string;
  touristPhone: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  preferredActivities: string[];
  dietaryNotes?: string;
  specialRequests?: string;
  totalEstimatedCost: number;
  status: 'Submitted' | 'Host Reviewing' | 'Accepted' | 'Declined' | 'Completed';
  hostReplyMessage?: string;
  createdAt: string;
}

export interface InfrastructureReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  category: 'Access Roads & Transport' | 'Drinking Water Supply' | 'Sanitation & Drainage' | 'Waste Management' | 'Telecom & Internet' | 'Power Supply & Grid' | 'Emergency Access';
  village: string;
  district: string;
  state: string;
  locationDetails: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Moderate' | 'Minor';
  reportedDate: string;
  status: 'Reported' | 'Verified by Community' | 'Escalated to Panchayat / Admin' | 'Work In Progress' | 'Resolved';
  assignedAuthority?: string;
  resolutionNotes?: string;
  imageUrl?: string;
  supportVotesCount: number;
}

export interface CommunityBusiness {
  id: string;
  businessName: string;
  category: 'Local Guide & Agro-Trek' | 'Traditional Catering & Food' | 'Rural Transport & Jeeps' | 'Village Handicrafts' | 'Equipment Rental';
  contactPerson: string;
  phone: string;
  village: string;
  district: string;
  description: string;
  isVerified: boolean;
  rating: number;
}

export interface AuditLogItem {
  id: string;
  action: string;
  performedBy: string;
  performedByRole: UserRole;
  targetEntity: string;
  details: string;
  timestamp: string;
}
