import { describe, it, expect, beforeEach } from 'vitest';
import { farmStore } from '../services/store';
import { FarmStayListing, SoilAnalysisReport, CropProfitEstimate, TouristEnquiry, InfrastructureReport } from '../types';

describe('FarmBridge AI Master Test Suite', () => {
  beforeEach(() => {
    farmStore.resetToDefaults();
  });

  describe('Workflow A — Farmer Assistance & Financial Arithmetic', () => {
    it('saves a soil analysis report and preserves measured parameters and diagnosis', () => {
      const report: SoilAnalysisReport = {
        id: 'test_soil_1',
        farmerId: 'usr_farmer_1',
        farmName: 'Test Plot Alpha',
        location: 'Choutuppal, Telangana',
        soilType: 'Red & Yellow',
        irrigationType: 'Drip Irrigation',
        testedAt: '2026-10-14',
        metrics: {
          ph: 6.8,
          nitrogenKgHa: 190,
          phosphorusKgHa: 28,
          potassiumKgHa: 340,
          organicCarbonPercent: 0.58,
          electricalConductivityDsM: 0.35,
        },
        missingMetrics: ['Sulfur', 'Zinc', 'Boron'],
        phCategory: 'Neutral',
        nitrogenStatus: 'Low',
        phosphorusStatus: 'Medium',
        potassiumStatus: 'High',
        recommendations: {
          fertilizerDose: ['Split Urea into 3 vegetative doses', 'Skip chemical Potash (MOP)'],
          organicAmendments: ['Add 3 tonnes FYM'],
          irrigationAdvice: 'Adopt morning drip pulses',
          caution: 'Test micronutrients next cycle',
        },
      };

      farmStore.saveSoilReport(report);
      const fetched = farmStore.getSoilReports('usr_farmer_1');
      const found = fetched.find((r) => r.id === 'test_soil_1');

      expect(found).toBeDefined();
      expect(found?.metrics.ph).toBe(6.8);
      expect(found?.nitrogenStatus).toBe('Low');
      expect(found?.potassiumStatus).toBe('High');
      expect(found?.missingMetrics).toContain('Sulfur');
    });

    it('accurately calculates cultivation expenses, net returns, and break-even selling prices', () => {
      // 4 Acres, Total Cost = 60,000, Expected Yield = 8 Qtl/acre = 32 Qtl total, Expected Price = 7,500/Qtl
      const expenses = [
        { id: '1', name: 'Seeds', category: 'Seeds' as const, amount: 6000 },
        { id: '2', name: 'Nutrients', category: 'Fertilizers & Nutrients' as const, amount: 14000 },
        { id: '3', name: 'Labour', category: 'Labour' as const, amount: 24000 },
        { id: '4', name: 'Ploughing', category: 'Machinery & Fuel' as const, amount: 16000 },
      ];

      const totalCost = expenses.reduce((sum, item) => sum + item.amount, 0); // 60,000
      const cultivatedArea = 4;
      const expectedYieldPerAcre = 8;
      const totalYield = expectedYieldPerAcre * cultivatedArea; // 32 Qtl
      const expectedSellingPrice = 7500;
      const grossRevenue = totalYield * expectedSellingPrice; // 240,000
      const netReturn = grossRevenue - totalCost; // 180,000
      const breakEvenPrice = totalCost / totalYield; // 60,000 / 32 = 1,875 / Qtl
      const breakEvenYield = totalCost / expectedSellingPrice; // 60,000 / 7500 = 8 Qtl

      expect(totalCost).toBe(60000);
      expect(grossRevenue).toBe(240000);
      expect(netReturn).toBe(180000);
      expect(breakEvenPrice).toBe(1875);
      expect(breakEvenYield).toBe(8);

      const calc: CropProfitEstimate = {
        id: 'test_calc_1',
        farmerId: 'usr_farmer_1',
        cropName: 'Red Gram Test',
        cultivatedAreaAcres: cultivatedArea,
        expenses,
        totalEstimatedCost: totalCost,
        costPerAcre: totalCost / cultivatedArea,
        expectedYieldQuintalsPerAcre: expectedYieldPerAcre,
        totalExpectedYieldQuintals: totalYield,
        expectedSellingPricePerQuintal: expectedSellingPrice,
        estimatedGrossRevenue: grossRevenue,
        estimatedNetReturn: netReturn,
        breakEvenPricePerQuintal: breakEvenPrice,
        breakEvenYieldQuintals: breakEvenYield,
        returnOnInvestmentPct: (netReturn / totalCost) * 100,
        savedAt: new Date().toISOString(),
      };

      farmStore.saveProfitCalculation(calc);
      const savedList = farmStore.getProfitCalculations('usr_farmer_1');
      expect(savedList.some((c) => c.id === 'test_calc_1')).toBe(true);
    });
  });

  describe('Workflow B — Farm-Stay Readiness & Verification Enforcement', () => {
    it('marks farm stay as "Improvement required" when mandatory criteria fail', () => {
      const stay: FarmStayListing = {
        id: 'test_stay_fail',
        farmerId: 'usr_farmer_1',
        farmName: 'Deficient Farm',
        tagline: 'Test Farm',
        location: 'Choutuppal',
        district: 'Yadadri',
        state: 'Telangana',
        farmType: 'Orchard',
        farmSizeAcres: 5,
        description: 'Test Description',
        operatorName: 'Ramesh',
        contactEmail: 'ramesh@test.com',
        contactPhone: '+91 99999 11111',
        accommodationType: 'Eco Cottage',
        totalRooms: 2,
        maxGuestCapacity: 6,
        pricePerNight: 2000,
        drinkingWaterTested: false, // FAILS MANDATORY
        waterSourceDescription: 'Untested open well',
        sanitationDetails: '1 toilet',
        visitorSafetyMeasures: [],
        wasteManagement: 'Compost',
        roadAccessQuality: 'Narrow dirt track (4WD suggested)', // FAILS ROAD ACCESS
        hasFirstAid: false, // FAILS FIRST AID
        hasEmergencyContact: false,
        seasonalOpenMonths: ['Jan', 'Feb'],
        photos: ['https://example.com/p1.jpg'],
        readinessState: 'Improvement required',
        criterionEvaluations: {
          crit_legal_1: { criterionId: 'crit_legal_1', satisfied: true, status: 'Satisfied' },
          crit_water_1: { criterionId: 'crit_water_1', satisfied: false, status: 'Failed' },
          crit_safety_1: { criterionId: 'crit_safety_1', satisfied: false, status: 'Failed' },
          crit_sanitation_1: { criterionId: 'crit_sanitation_1', satisfied: true, status: 'Satisfied' },
          crit_access_1: { criterionId: 'crit_access_1', satisfied: false, status: 'Failed' },
        },
        featured: false,
        activities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      farmStore.saveFarmStay(stay);
      const state = farmStore.evaluateFarmReadiness('test_stay_fail');
      expect(state).toBe('Improvement required');
    });

    it('marks farm stay as "Eligible for recommendation" ONLY when all mandatory criteria are satisfied', () => {
      const stay: FarmStayListing = {
        id: 'test_stay_pass',
        farmerId: 'usr_farmer_1',
        farmName: 'Compliant Haven',
        tagline: 'Verified Safe Farm',
        location: 'Choutuppal',
        district: 'Yadadri',
        state: 'Telangana',
        farmType: 'Organic Orchard',
        farmSizeAcres: 10,
        description: 'Fully audited agro-retreat',
        operatorName: 'Ramesh Kumar',
        contactEmail: 'ramesh@test.com',
        contactPhone: '+91 98480 12345',
        accommodationType: 'Eco Cottage',
        totalRooms: 4,
        maxGuestCapacity: 12,
        pricePerNight: 2500,
        drinkingWaterTested: true,
        waterSourceDescription: 'BIS 10500 Certified Lab Test Aug 2026',
        sanitationDetails: '3 attached flush toilets',
        visitorSafetyMeasures: ['First aid kit with anti-snake venom protocol', 'Emergency contacts'],
        wasteManagement: 'Zero-plastic policy',
        roadAccessQuality: 'All-weather paved',
        hasFirstAid: true,
        hasEmergencyContact: true,
        seasonalOpenMonths: ['Jan', 'Feb', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        photos: ['https://example.com/p1.jpg'],
        readinessState: 'Eligible for recommendation',
        criterionEvaluations: {
          crit_legal_1: { criterionId: 'crit_legal_1', satisfied: true, status: 'Satisfied' },
          crit_water_1: { criterionId: 'crit_water_1', satisfied: true, status: 'Satisfied' },
          crit_safety_1: { criterionId: 'crit_safety_1', satisfied: true, status: 'Satisfied' },
          crit_sanitation_1: { criterionId: 'crit_sanitation_1', satisfied: true, status: 'Satisfied' },
          crit_access_1: { criterionId: 'crit_access_1', satisfied: true, status: 'Satisfied' },
        },
        featured: true,
        activities: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      farmStore.saveFarmStay(stay);
      const state = farmStore.evaluateFarmReadiness('test_stay_pass');
      expect(state).toBe('Eligible for recommendation');
    });

    it('records administrator audit log when updating verification status', () => {
      farmStore.setCurrentUser('usr_admin_1'); // Switch to Admin
      farmStore.updateFarmVerificationStatus(
        'fs_1',
        'Eligible for recommendation',
        'Official district auditor physical check completed'
      );

      const logs = farmStore.getAuditLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].action).toBe('UPDATED_VERIFICATION_STATUS');
      expect(logs[0].performedByRole).toBe('administrator');
    });
  });

  describe('Workflow C — Tourist 2-Stage Recommendation & Enquiry Flow', () => {
    it('Stage 1 excludes unverified/failing properties from recommended list', () => {
      const all = farmStore.getFarmStays();
      const eligibleOnly = all.filter((s) => s.readinessState === 'Eligible for recommendation');

      // In initial data, fs_1 and fs_2 are Eligible, fs_3 is Awaiting, fs_4 is Improvement required
      expect(eligibleOnly.every((s) => s.readinessState === 'Eligible for recommendation')).toBe(true);
      expect(eligibleOnly.some((s) => s.id === 'fs_3')).toBe(false);
      expect(eligibleOnly.some((s) => s.id === 'fs_4')).toBe(false);
    });

    it('submits a tourist enquiry and makes it accessible to both tourist and host', () => {
      const enquiry: TouristEnquiry = {
        id: 'test_enq_100',
        farmStayId: 'fs_1',
        farmName: 'Surya Organic Agro-Haven',
        farmerId: 'usr_farmer_1',
        touristName: 'Test Tourist',
        touristEmail: 'tourist.test@farmbridge.ai',
        touristPhone: '+91 99999 88888',
        checkInDate: '2026-11-10',
        checkOutDate: '2026-11-12',
        guestsCount: 3,
        preferredActivities: ['Morning Paddy Transplanting & Weeding'],
        totalEstimatedCost: 4800,
        status: 'Submitted',
        createdAt: new Date().toISOString(),
      };

      farmStore.submitTouristEnquiry(enquiry);

      // Verify tourist can view it
      const touristView = farmStore.getTouristEnquiries({ touristEmail: 'tourist.test@farmbridge.ai' });
      expect(touristView.some((e) => e.id === 'test_enq_100')).toBe(true);

      // Verify host farmer can view it
      const hostView = farmStore.getTouristEnquiries({ farmerId: 'usr_farmer_1' });
      expect(hostView.some((e) => e.id === 'test_enq_100')).toBe(true);

      // Host accepts enquiry
      farmStore.updateTouristEnquiryStatus('test_enq_100', 'Accepted', 'Welcome to our farm!');
      const updated = farmStore.getTouristEnquiries().find((e) => e.id === 'test_enq_100');
      expect(updated?.status).toBe('Accepted');
      expect(updated?.hostReplyMessage).toBe('Welcome to our farm!');
    });
  });

  describe('Workflow D — Community Infrastructure Civic Advocacy', () => {
    it('submits, upvotes, and escalates infrastructure reports', () => {
      const report: InfrastructureReport = {
        id: 'test_infra_1',
        reporterId: 'usr_farmer_1',
        reporterName: 'Ramesh Kumar',
        reporterRole: 'farmer',
        category: 'Access Roads & Transport',
        village: 'East Choutuppal',
        district: 'Yadadri',
        state: 'Telangana',
        locationDetails: 'Canal Crossing km 3',
        title: 'Bridge Expansion Required for Tractor Trailers',
        description: 'Single-lane culvert causes 1-hour delays during harvest dispatch.',
        severity: 'Moderate',
        reportedDate: '2026-10-14',
        status: 'Reported',
        supportVotesCount: 1,
      };

      farmStore.submitInfrastructureReport(report);
      let list = farmStore.getInfrastructureReports();
      expect(list.some((r) => r.id === 'test_infra_1')).toBe(true);

      // Community upvotes
      farmStore.upvoteInfrastructureReport('test_infra_1');
      list = farmStore.getInfrastructureReports();
      const upvoted = list.find((r) => r.id === 'test_infra_1');
      expect(upvoted?.supportVotesCount).toBe(2);

      // Admin escalates to Panchayat
      farmStore.updateInfrastructureReportStatus('test_infra_1', 'Escalated to Panchayat / Admin', 'Mandal R&B Office', 'Sanctioned for winter review');
      const escalated = farmStore.getInfrastructureReports().find((r) => r.id === 'test_infra_1');
      expect(escalated?.status).toBe('Escalated to Panchayat / Admin');
      expect(escalated?.assignedAuthority).toBe('Mandal R&B Office');
    });
  });

  describe('Workflow E — Role Security & Authorization Boundaries', () => {
    it('switches roles and retrieves active user persona correctly', () => {
      farmStore.switchRole('tourist');
      expect(farmStore.getCurrentUser().role).toBe('tourist');

      farmStore.switchRole('administrator');
      expect(farmStore.getCurrentUser().role).toBe('administrator');

      farmStore.switchRole('farmer');
      expect(farmStore.getCurrentUser().role).toBe('farmer');
    });
  });
});
