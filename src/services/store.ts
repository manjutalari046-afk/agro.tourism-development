import {
  UserProfile,
  UserRole,
  FarmStayListing,
  ReadinessCriterion,
  SoilAnalysisReport,
  CropProfitEstimate,
  CropRotationPlan,
  CropHealthCheck,
  ProduceListing,
  ProduceEnquiry,
  GovernmentScheme,
  InfrastructureReport,
  CommunityBusiness,
  AuditLogItem,
  TouristEnquiry,
  ReadinessState,
} from '../types';
import {
  INITIAL_USERS,
  READINESS_CRITERIA,
  INITIAL_FARM_STAYS,
  INITIAL_SOIL_REPORTS,
  INITIAL_PROFIT_CALCS,
  PRODUCE_LISTINGS,
  GOVERNMENT_SCHEMES,
  INFRASTRUCTURE_REPORTS,
  COMMUNITY_BUSINESSES,
  INITIAL_TOURIST_ENQUIRIES,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'farmbridge_current_user_id',
  USERS: 'farmbridge_users',
  FARM_STAYS: 'farmbridge_farm_stays',
  CRITERIA: 'farmbridge_criteria',
  SOIL_REPORTS: 'farmbridge_soil_reports',
  PROFIT_CALCS: 'farmbridge_profit_calcs',
  ROTATION_PLANS: 'farmbridge_rotation_plans',
  HEALTH_CHECKS: 'farmbridge_health_checks',
  PRODUCE_LISTINGS: 'farmbridge_produce_listings',
  PRODUCE_ENQUIRIES: 'farmbridge_produce_enquiries',
  SCHEMES: 'farmbridge_schemes',
  INFRA_REPORTS: 'farmbridge_infra_reports',
  BUSINESSES: 'farmbridge_businesses',
  TOURIST_ENQUIRIES: 'farmbridge_tourist_enquiries',
  AUDIT_LOGS: 'farmbridge_audit_logs',
};

/**
 * High-performance Store with in-memory caching to eliminate redundant JSON parsing
 * and synchronous localStorage bottlenecks.
 */
class FarmBridgeStore {
  private listeners: Set<() => void> = new Set();
  
  // In-memory cache
  private cache: {
    currentUserId: string | null;
    users: UserProfile[] | null;
    farmStays: FarmStayListing[] | null;
    criteria: ReadinessCriterion[] | null;
    soilReports: SoilAnalysisReport[] | null;
    profitCalcs: CropProfitEstimate[] | null;
    rotationPlans: CropRotationPlan[] | null;
    healthChecks: CropHealthCheck[] | null;
    produceListings: ProduceListing[] | null;
    produceEnquiries: ProduceEnquiry[] | null;
    schemes: GovernmentScheme[] | null;
    infraReports: InfrastructureReport[] | null;
    businesses: CommunityBusiness[] | null;
    touristEnquiries: TouristEnquiry[] | null;
    auditLogs: AuditLogItem[] | null;
  } = {
    currentUserId: null,
    users: null,
    farmStays: null,
    criteria: null,
    soilReports: null,
    profitCalcs: null,
    rotationPlans: null,
    healthChecks: null,
    produceListings: null,
    produceEnquiries: null,
    schemes: null,
    infraReports: null,
    businesses: null,
    touristEnquiries: null,
    auditLogs: null,
  };

  constructor() {
    this.ensureInitialized();
  }

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private ensureInitialized() {
    if (!this.hasStorage()) {
      // In-memory fallback for test runner / node environment
      this.cache.users = [...INITIAL_USERS];
      this.cache.currentUserId = INITIAL_USERS[0].id;
      this.cache.farmStays = JSON.parse(JSON.stringify(INITIAL_FARM_STAYS));
      this.cache.criteria = [...READINESS_CRITERIA];
      this.cache.soilReports = [...INITIAL_SOIL_REPORTS];
      this.cache.profitCalcs = [...INITIAL_PROFIT_CALCS];
      this.cache.rotationPlans = [];
      this.cache.healthChecks = [];
      this.cache.produceListings = [...PRODUCE_LISTINGS];
      this.cache.produceEnquiries = [];
      this.cache.schemes = [...GOVERNMENT_SCHEMES];
      this.cache.infraReports = [...INFRASTRUCTURE_REPORTS];
      this.cache.businesses = [...COMMUNITY_BUSINESSES];
      this.cache.touristEnquiries = [...INITIAL_TOURIST_ENQUIRIES];
      this.cache.auditLogs = [...INITIAL_AUDIT_LOGS];
      return;
    }

    try {
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, INITIAL_USERS[0].id);
      }
      if (!localStorage.getItem(STORAGE_KEYS.FARM_STAYS)) {
        localStorage.setItem(STORAGE_KEYS.FARM_STAYS, JSON.stringify(INITIAL_FARM_STAYS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CRITERIA)) {
        localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(READINESS_CRITERIA));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SOIL_REPORTS)) {
        localStorage.setItem(STORAGE_KEYS.SOIL_REPORTS, JSON.stringify(INITIAL_SOIL_REPORTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PROFIT_CALCS)) {
        localStorage.setItem(STORAGE_KEYS.PROFIT_CALCS, JSON.stringify(INITIAL_PROFIT_CALCS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ROTATION_PLANS)) {
        localStorage.setItem(STORAGE_KEYS.ROTATION_PLANS, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.HEALTH_CHECKS)) {
        localStorage.setItem(STORAGE_KEYS.HEALTH_CHECKS, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PRODUCE_LISTINGS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCE_LISTINGS, JSON.stringify(PRODUCE_LISTINGS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PRODUCE_ENQUIRIES)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCE_ENQUIRIES, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SCHEMES)) {
        localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(GOVERNMENT_SCHEMES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.INFRA_REPORTS)) {
        localStorage.setItem(STORAGE_KEYS.INFRA_REPORTS, JSON.stringify(INFRASTRUCTURE_REPORTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.BUSINESSES)) {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(COMMUNITY_BUSINESSES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.TOURIST_ENQUIRIES)) {
        localStorage.setItem(STORAGE_KEYS.TOURIST_ENQUIRIES, JSON.stringify(INITIAL_TOURIST_ENQUIRIES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      }
    } catch (e) {
      console.warn('Storage initialization fallback:', e);
    }
  }

  private saveKey(key: string, data: any) {
    if (this.hasStorage()) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        console.error('Storage quota exceeded or unavailable:', err);
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error('Store listener error:', e);
      }
    });
  }

  // --- USER PROFILES ---
  public getUsers(): UserProfile[] {
    if (this.cache.users) return this.cache.users;
    if (!this.hasStorage()) return INITIAL_USERS;
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    this.cache.users = raw ? JSON.parse(raw) : INITIAL_USERS;
    return this.cache.users!;
  }

  public getCurrentUser(): UserProfile {
    const users = this.getUsers();
    let currentId = this.cache.currentUserId;
    if (!currentId && this.hasStorage()) {
      currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      this.cache.currentUserId = currentId;
    }
    return users.find((u) => u.id === currentId) || users[0];
  }

  public setCurrentUser(userId: string) {
    this.cache.currentUserId = userId;
    if (this.hasStorage()) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    }
    this.notify();
  }

  public switchRole(role: UserRole) {
    const users = this.getUsers();
    const target = users.find((u) => u.role === role);
    if (target) {
      this.setCurrentUser(target.id);
    }
  }

  public updateProfile(updated: Partial<UserProfile>) {
    const users = this.getUsers();
    const cur = this.getCurrentUser();
    const idx = users.findIndex((u) => u.id === cur.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updated };
      this.cache.users = users;
      this.saveKey(STORAGE_KEYS.USERS, users);
      this.notify();
    }
  }

  // --- FARM STAYS ---
  public getFarmStays(): FarmStayListing[] {
    if (this.cache.farmStays) return this.cache.farmStays;
    if (!this.hasStorage()) return INITIAL_FARM_STAYS;
    const raw = localStorage.getItem(STORAGE_KEYS.FARM_STAYS);
    this.cache.farmStays = raw ? JSON.parse(raw) : INITIAL_FARM_STAYS;
    return this.cache.farmStays!;
  }

  public getFarmStayById(id: string): FarmStayListing | undefined {
    return this.getFarmStays().find((f) => f.id === id);
  }

  public getFarmerFarmStay(farmerId: string): FarmStayListing | undefined {
    return this.getFarmStays().find((f) => f.farmerId === farmerId);
  }

  public saveFarmStay(farmStay: FarmStayListing) {
    const stays = [...this.getFarmStays()];
    const idx = stays.findIndex((s) => s.id === farmStay.id);
    if (idx >= 0) {
      stays[idx] = { ...farmStay, updatedAt: new Date().toISOString() };
    } else {
      stays.push({ ...farmStay, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.cache.farmStays = stays;
    this.saveKey(STORAGE_KEYS.FARM_STAYS, stays);
    this.addAuditLog('SAVED_FARM_STAY', farmStay.farmName, `Saved details for farm stay ${farmStay.id}`);
    this.notify();
  }

  public evaluateFarmReadiness(farmStayId: string, recalculate = false): ReadinessState {
    const stay = this.getFarmStayById(farmStayId);
    if (!stay) return 'Improvement required';

    const criteria = this.getCriteria();
    const mandatoryCriteria = criteria.filter((c) => c.isMandatory);

    let allMandatorySatisfied = true;
    let anyMissingEvidence = false;
    let anyFailed = false;

    for (const m of mandatoryCriteria) {
      const evalState = stay.criterionEvaluations?.[m.id];
      if (!evalState || !evalState.satisfied) {
        allMandatorySatisfied = false;
        if (evalState?.status === 'Evidence Missing' || !evalState) {
          anyMissingEvidence = true;
        } else {
          anyFailed = true;
        }
      }
    }

    let newState: ReadinessState = 'Improvement required';
    if (allMandatorySatisfied) {
      newState = 'Eligible for recommendation';
    } else if (anyMissingEvidence && !anyFailed) {
      newState = 'Awaiting verification';
    } else {
      newState = 'Improvement required';
    }

    if (recalculate && stay.readinessState !== newState) {
      stay.readinessState = newState;
      this.saveFarmStay(stay);
    }

    return newState;
  }

  public updateFarmVerificationStatus(
    farmStayId: string,
    state: ReadinessState,
    notes: string,
    evaluationsUpdate?: Record<string, any>
  ) {
    const stays = [...this.getFarmStays()];
    const idx = stays.findIndex((s) => s.id === farmStayId);
    if (idx >= 0) {
      const curUser = this.getCurrentUser();
      stays[idx] = {
        ...stays[idx],
        readinessState: state,
        verificationNotes: notes,
        verificationDate: new Date().toISOString().split('T')[0],
        verifiedByAdminId: curUser.id,
      };
      if (evaluationsUpdate) {
        stays[idx].criterionEvaluations = {
          ...stays[idx].criterionEvaluations,
          ...evaluationsUpdate,
        };
      }
      this.cache.farmStays = stays;
      this.saveKey(STORAGE_KEYS.FARM_STAYS, stays);
      this.addAuditLog('UPDATED_VERIFICATION_STATUS', stays[idx].farmName, `Status set to ${state}. Notes: ${notes}`);
      this.notify();
    }
  }

  // --- CRITERIA ---
  public getCriteria(): ReadinessCriterion[] {
    if (this.cache.criteria) return this.cache.criteria;
    if (!this.hasStorage()) return READINESS_CRITERIA;
    const raw = localStorage.getItem(STORAGE_KEYS.CRITERIA);
    this.cache.criteria = raw ? JSON.parse(raw) : READINESS_CRITERIA;
    return this.cache.criteria!;
  }

  public saveCriterion(criterion: ReadinessCriterion) {
    const criteria = [...this.getCriteria()];
    const idx = criteria.findIndex((c) => c.id === criterion.id);
    if (idx >= 0) {
      criteria[idx] = criterion;
    } else {
      criteria.push(criterion);
    }
    this.cache.criteria = criteria;
    this.saveKey(STORAGE_KEYS.CRITERIA, criteria);
    this.addAuditLog('UPDATED_CRITERION', criterion.title, `Criterion modified: mandatory=${criterion.isMandatory}`);
    this.notify();
  }

  // --- SOIL REPORTS ---
  public getSoilReports(farmerId?: string): SoilAnalysisReport[] {
    let reports = this.cache.soilReports;
    if (!reports) {
      if (!this.hasStorage()) {
        reports = INITIAL_SOIL_REPORTS;
      } else {
        const raw = localStorage.getItem(STORAGE_KEYS.SOIL_REPORTS);
        reports = raw ? JSON.parse(raw) : INITIAL_SOIL_REPORTS;
      }
      this.cache.soilReports = reports;
    }
    if (farmerId) {
      return reports!.filter((r) => r.farmerId === farmerId);
    }
    return reports!;
  }

  public saveSoilReport(report: SoilAnalysisReport) {
    const reports = [...this.getSoilReports()];
    const idx = reports.findIndex((r) => r.id === report.id);
    if (idx >= 0) {
      reports[idx] = report;
    } else {
      reports.unshift(report);
    }
    this.cache.soilReports = reports;
    this.saveKey(STORAGE_KEYS.SOIL_REPORTS, reports);
    this.notify();
  }

  // --- PROFIT CALCULATIONS ---
  public getProfitCalculations(farmerId?: string): CropProfitEstimate[] {
    let list = this.cache.profitCalcs;
    if (!list) {
      if (!this.hasStorage()) {
        list = INITIAL_PROFIT_CALCS;
      } else {
        const raw = localStorage.getItem(STORAGE_KEYS.PROFIT_CALCS);
        list = raw ? JSON.parse(raw) : INITIAL_PROFIT_CALCS;
      }
      this.cache.profitCalcs = list;
    }
    if (farmerId) {
      return list!.filter((p) => p.farmerId === farmerId);
    }
    return list!;
  }

  public saveProfitCalculation(calc: CropProfitEstimate) {
    const list = [...this.getProfitCalculations()];
    const idx = list.findIndex((c) => c.id === calc.id);
    if (idx >= 0) {
      list[idx] = calc;
    } else {
      list.unshift(calc);
    }
    this.cache.profitCalcs = list;
    this.saveKey(STORAGE_KEYS.PROFIT_CALCS, list);
    this.notify();
  }

  public deleteProfitCalculation(id: string) {
    const list = this.getProfitCalculations().filter((c) => c.id !== id);
    this.cache.profitCalcs = list;
    this.saveKey(STORAGE_KEYS.PROFIT_CALCS, list);
    this.notify();
  }

  // --- CROP ROTATION PLANS ---
  public getRotationPlans(farmerId?: string): CropRotationPlan[] {
    let list = this.cache.rotationPlans;
    if (!list) {
      if (!this.hasStorage()) {
        list = [];
      } else {
        const raw = localStorage.getItem(STORAGE_KEYS.ROTATION_PLANS);
        list = raw ? JSON.parse(raw) : [];
      }
      this.cache.rotationPlans = list;
    }
    if (farmerId) {
      return list!.filter((p) => p.farmerId === farmerId);
    }
    return list!;
  }

  public saveRotationPlan(plan: CropRotationPlan) {
    const list = [...this.getRotationPlans()];
    list.unshift(plan);
    this.cache.rotationPlans = list;
    this.saveKey(STORAGE_KEYS.ROTATION_PLANS, list);
    this.notify();
  }

  // --- CROP HEALTH CHECKS ---
  public getHealthChecks(farmerId?: string): CropHealthCheck[] {
    let list = this.cache.healthChecks;
    if (!list) {
      if (!this.hasStorage()) {
        list = [];
      } else {
        const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_CHECKS);
        list = raw ? JSON.parse(raw) : [];
      }
      this.cache.healthChecks = list;
    }
    if (farmerId) {
      return list!.filter((c) => c.farmerId === farmerId);
    }
    return list!;
  }

  public saveHealthCheck(check: CropHealthCheck) {
    const list = [...this.getHealthChecks()];
    list.unshift(check);
    this.cache.healthChecks = list;
    this.saveKey(STORAGE_KEYS.HEALTH_CHECKS, list);
    this.notify();
  }

  // --- PRODUCE MARKETPLACE ---
  public getProduceListings(): ProduceListing[] {
    if (this.cache.produceListings) return this.cache.produceListings;
    if (!this.hasStorage()) return PRODUCE_LISTINGS;
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCE_LISTINGS);
    this.cache.produceListings = raw ? JSON.parse(raw) : PRODUCE_LISTINGS;
    return this.cache.produceListings!;
  }

  public saveProduceListing(item: ProduceListing) {
    const list = [...this.getProduceListings()];
    const idx = list.findIndex((p) => p.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    this.cache.produceListings = list;
    this.saveKey(STORAGE_KEYS.PRODUCE_LISTINGS, list);
    this.notify();
  }

  public deleteProduceListing(id: string) {
    const list = this.getProduceListings().filter((p) => p.id !== id);
    this.cache.produceListings = list;
    this.saveKey(STORAGE_KEYS.PRODUCE_LISTINGS, list);
    this.notify();
  }

  public getProduceEnquiries(farmerId?: string): ProduceEnquiry[] {
    let list = this.cache.produceEnquiries;
    if (!list) {
      if (!this.hasStorage()) {
        list = [];
      } else {
        const raw = localStorage.getItem(STORAGE_KEYS.PRODUCE_ENQUIRIES);
        list = raw ? JSON.parse(raw) : [];
      }
      this.cache.produceEnquiries = list;
    }
    if (farmerId) {
      return list!.filter((e) => e.farmerId === farmerId);
    }
    return list!;
  }

  public submitProduceEnquiry(enquiry: ProduceEnquiry) {
    const list = [...this.getProduceEnquiries()];
    list.unshift(enquiry);
    this.cache.produceEnquiries = list;
    this.saveKey(STORAGE_KEYS.PRODUCE_ENQUIRIES, list);
    this.notify();
  }

  // --- GOVERNMENT SCHEMES ---
  public getSchemes(): GovernmentScheme[] {
    if (this.cache.schemes) return this.cache.schemes;
    if (!this.hasStorage()) return GOVERNMENT_SCHEMES;
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEMES);
    this.cache.schemes = raw ? JSON.parse(raw) : GOVERNMENT_SCHEMES;
    return this.cache.schemes!;
  }

  public saveScheme(scheme: GovernmentScheme) {
    const list = [...this.getSchemes()];
    const idx = list.findIndex((s) => s.id === scheme.id);
    if (idx >= 0) {
      list[idx] = scheme;
    } else {
      list.unshift(scheme);
    }
    this.cache.schemes = list;
    this.saveKey(STORAGE_KEYS.SCHEMES, list);
    this.addAuditLog('UPDATED_SCHEME', scheme.name, `Scheme saved/updated by admin`);
    this.notify();
  }

  // --- TOURIST ENQUIRIES ---
  public getTouristEnquiries(filter?: { farmerId?: string; touristEmail?: string }): TouristEnquiry[] {
    let list = this.cache.touristEnquiries;
    if (!list) {
      if (!this.hasStorage()) {
        list = INITIAL_TOURIST_ENQUIRIES;
      } else {
        const raw = localStorage.getItem(STORAGE_KEYS.TOURIST_ENQUIRIES);
        list = raw ? JSON.parse(raw) : INITIAL_TOURIST_ENQUIRIES;
      }
      this.cache.touristEnquiries = list;
    }
    if (filter?.farmerId) {
      return list!.filter((e) => e.farmerId === filter.farmerId);
    }
    if (filter?.touristEmail) {
      return list!.filter((e) => e.touristEmail.toLowerCase() === filter.touristEmail?.toLowerCase());
    }
    return list!;
  }

  public submitTouristEnquiry(enquiry: TouristEnquiry) {
    const list = [...this.getTouristEnquiries()];
    list.unshift(enquiry);
    this.cache.touristEnquiries = list;
    this.saveKey(STORAGE_KEYS.TOURIST_ENQUIRIES, list);
    this.notify();
  }

  public updateTouristEnquiryStatus(
    id: string,
    status: TouristEnquiry['status'],
    hostReplyMessage?: string
  ) {
    const list = [...this.getTouristEnquiries()];
    const idx = list.findIndex((e) => e.id === id);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        status,
        ...(hostReplyMessage ? { hostReplyMessage } : {}),
      };
      this.cache.touristEnquiries = list;
      this.saveKey(STORAGE_KEYS.TOURIST_ENQUIRIES, list);
      this.notify();
    }
  }

  // --- INFRASTRUCTURE REPORTS ---
  public getInfrastructureReports(): InfrastructureReport[] {
    if (this.cache.infraReports) return this.cache.infraReports;
    if (!this.hasStorage()) return INFRASTRUCTURE_REPORTS;
    const raw = localStorage.getItem(STORAGE_KEYS.INFRA_REPORTS);
    this.cache.infraReports = raw ? JSON.parse(raw) : INFRASTRUCTURE_REPORTS;
    return this.cache.infraReports!;
  }

  public submitInfrastructureReport(report: InfrastructureReport) {
    const list = [...this.getInfrastructureReports()];
    list.unshift(report);
    this.cache.infraReports = list;
    this.saveKey(STORAGE_KEYS.INFRA_REPORTS, list);
    this.addAuditLog('REPORTED_INFRASTRUCTURE_GAP', report.title, `Category: ${report.category}, Village: ${report.village}`);
    this.notify();
  }

  public upvoteInfrastructureReport(id: string) {
    const list = [...this.getInfrastructureReports()];
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], supportVotesCount: list[idx].supportVotesCount + 1 };
      this.cache.infraReports = list;
      this.saveKey(STORAGE_KEYS.INFRA_REPORTS, list);
      this.notify();
    }
  }

  public updateInfrastructureReportStatus(
    id: string,
    status: InfrastructureReport['status'],
    assignedAuthority?: string,
    resolutionNotes?: string
  ) {
    const list = [...this.getInfrastructureReports()];
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        status,
        ...(assignedAuthority ? { assignedAuthority } : {}),
        ...(resolutionNotes ? { resolutionNotes } : {}),
      };
      this.cache.infraReports = list;
      this.saveKey(STORAGE_KEYS.INFRA_REPORTS, list);
      this.addAuditLog('UPDATED_INFRA_STATUS', list[idx].title, `New status: ${status}`);
      this.notify();
    }
  }

  // --- COMMUNITY BUSINESSES ---
  public getCommunityBusinesses(): CommunityBusiness[] {
    if (this.cache.businesses) return this.cache.businesses;
    if (!this.hasStorage()) return COMMUNITY_BUSINESSES;
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    this.cache.businesses = raw ? JSON.parse(raw) : COMMUNITY_BUSINESSES;
    return this.cache.businesses!;
  }

  public saveCommunityBusiness(biz: CommunityBusiness) {
    const list = [...this.getCommunityBusinesses()];
    const idx = list.findIndex((b) => b.id === biz.id);
    if (idx >= 0) {
      list[idx] = biz;
    } else {
      list.unshift(biz);
    }
    this.cache.businesses = list;
    this.saveKey(STORAGE_KEYS.BUSINESSES, list);
    this.notify();
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLogItem[] {
    if (this.cache.auditLogs) return this.cache.auditLogs;
    if (!this.hasStorage()) return INITIAL_AUDIT_LOGS;
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    this.cache.auditLogs = raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
    return this.cache.auditLogs!;
  }

  public addAuditLog(action: string, targetEntity: string, details: string) {
    const cur = this.getCurrentUser();
    const logs = [...this.getAuditLogs()];
    const item: AuditLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      performedBy: cur.name,
      performedByRole: cur.role,
      targetEntity,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(item);
    this.cache.auditLogs = logs.slice(0, 100);
    this.saveKey(STORAGE_KEYS.AUDIT_LOGS, this.cache.auditLogs);
  }

  // --- RESET ALL DATA ---
  public resetToDefaults() {
    this.cache = {
      currentUserId: INITIAL_USERS[0].id,
      users: [...INITIAL_USERS],
      farmStays: JSON.parse(JSON.stringify(INITIAL_FARM_STAYS)),
      criteria: [...READINESS_CRITERIA],
      soilReports: [...INITIAL_SOIL_REPORTS],
      profitCalcs: [...INITIAL_PROFIT_CALCS],
      rotationPlans: [],
      healthChecks: [],
      produceListings: [...PRODUCE_LISTINGS],
      produceEnquiries: [],
      schemes: [...GOVERNMENT_SCHEMES],
      infraReports: [...INFRASTRUCTURE_REPORTS],
      businesses: [...COMMUNITY_BUSINESSES],
      touristEnquiries: [...INITIAL_TOURIST_ENQUIRIES],
      auditLogs: [...INITIAL_AUDIT_LOGS],
    };

    if (this.hasStorage()) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, INITIAL_USERS[0].id);
      localStorage.setItem(STORAGE_KEYS.FARM_STAYS, JSON.stringify(INITIAL_FARM_STAYS));
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(READINESS_CRITERIA));
      localStorage.setItem(STORAGE_KEYS.SOIL_REPORTS, JSON.stringify(INITIAL_SOIL_REPORTS));
      localStorage.setItem(STORAGE_KEYS.PROFIT_CALCS, JSON.stringify(INITIAL_PROFIT_CALCS));
      localStorage.setItem(STORAGE_KEYS.ROTATION_PLANS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.HEALTH_CHECKS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.PRODUCE_LISTINGS, JSON.stringify(PRODUCE_LISTINGS));
      localStorage.setItem(STORAGE_KEYS.PRODUCE_ENQUIRIES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(GOVERNMENT_SCHEMES));
      localStorage.setItem(STORAGE_KEYS.INFRA_REPORTS, JSON.stringify(INFRASTRUCTURE_REPORTS));
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(COMMUNITY_BUSINESSES));
      localStorage.setItem(STORAGE_KEYS.TOURIST_ENQUIRIES, JSON.stringify(INITIAL_TOURIST_ENQUIRIES));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    this.notify();
  }
}

export const farmStore = new FarmBridgeStore();
