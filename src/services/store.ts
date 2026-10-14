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

class FarmBridgeStore {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, INITIAL_USERS[0].id); // Default to Farmer
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
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- CURRENT USER & ROLES ---
  public getUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  public getCurrentUser(): UserProfile {
    const users = this.getUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return users.find((u) => u.id === currentId) || users[0];
  }

  public setCurrentUser(userId: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
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
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.notify();
    }
  }

  // --- FARM STAYS ---
  public getFarmStays(): FarmStayListing[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FARM_STAYS);
    return raw ? JSON.parse(raw) : INITIAL_FARM_STAYS;
  }

  public getFarmStayById(id: string): FarmStayListing | undefined {
    return this.getFarmStays().find((f) => f.id === id);
  }

  public getFarmerFarmStay(farmerId: string): FarmStayListing | undefined {
    return this.getFarmStays().find((f) => f.farmerId === farmerId);
  }

  public saveFarmStay(farmStay: FarmStayListing) {
    const stays = this.getFarmStays();
    const idx = stays.findIndex((s) => s.id === farmStay.id);
    if (idx >= 0) {
      stays[idx] = { ...farmStay, updatedAt: new Date().toISOString() };
    } else {
      stays.push({ ...farmStay, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.FARM_STAYS, JSON.stringify(stays));
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
      const evalState = stay.criterionEvaluations[m.id];
      if (!evalState || !evalState.satisfied) {
        allMandatorySatisfied = false;
        if (evalState?.status === 'Evidence Missing') {
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
    const stays = this.getFarmStays();
    const idx = stays.findIndex((s) => s.id === farmStayId);
    if (idx >= 0) {
      const curUser = this.getCurrentUser();
      stays[idx].readinessState = state;
      stays[idx].verificationNotes = notes;
      stays[idx].verificationDate = new Date().toISOString().split('T')[0];
      stays[idx].verifiedByAdminId = curUser.id;
      if (evaluationsUpdate) {
        stays[idx].criterionEvaluations = {
          ...stays[idx].criterionEvaluations,
          ...evaluationsUpdate,
        };
      }
      localStorage.setItem(STORAGE_KEYS.FARM_STAYS, JSON.stringify(stays));
      this.addAuditLog('UPDATED_VERIFICATION_STATUS', stays[idx].farmName, `Status set to ${state}. Notes: ${notes}`);
      this.notify();
    }
  }

  // --- CRITERIA ---
  public getCriteria(): ReadinessCriterion[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CRITERIA);
    return raw ? JSON.parse(raw) : READINESS_CRITERIA;
  }

  public saveCriterion(criterion: ReadinessCriterion) {
    const criteria = this.getCriteria();
    const idx = criteria.findIndex((c) => c.id === criterion.id);
    if (idx >= 0) {
      criteria[idx] = criterion;
    } else {
      criteria.push(criterion);
    }
    localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria));
    this.addAuditLog('UPDATED_CRITERION', criterion.title, `Criterion modified: mandatory=${criterion.isMandatory}`);
    this.notify();
  }

  // --- SOIL REPORTS ---
  public getSoilReports(farmerId?: string): SoilAnalysisReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SOIL_REPORTS);
    const reports: SoilAnalysisReport[] = raw ? JSON.parse(raw) : INITIAL_SOIL_REPORTS;
    if (farmerId) {
      return reports.filter((r) => r.farmerId === farmerId);
    }
    return reports;
  }

  public saveSoilReport(report: SoilAnalysisReport) {
    const reports = this.getSoilReports();
    const idx = reports.findIndex((r) => r.id === report.id);
    if (idx >= 0) {
      reports[idx] = report;
    } else {
      reports.unshift(report);
    }
    localStorage.setItem(STORAGE_KEYS.SOIL_REPORTS, JSON.stringify(reports));
    this.notify();
  }

  // --- PROFIT CALCULATIONS ---
  public getProfitCalculations(farmerId?: string): CropProfitEstimate[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFIT_CALCS);
    const list: CropProfitEstimate[] = raw ? JSON.parse(raw) : INITIAL_PROFIT_CALCS;
    if (farmerId) {
      return list.filter((p) => p.farmerId === farmerId);
    }
    return list;
  }

  public saveProfitCalculation(calc: CropProfitEstimate) {
    const list = this.getProfitCalculations();
    const idx = list.findIndex((c) => c.id === calc.id);
    if (idx >= 0) {
      list[idx] = calc;
    } else {
      list.unshift(calc);
    }
    localStorage.setItem(STORAGE_KEYS.PROFIT_CALCS, JSON.stringify(list));
    this.notify();
  }

  public deleteProfitCalculation(id: string) {
    const list = this.getProfitCalculations().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROFIT_CALCS, JSON.stringify(list));
    this.notify();
  }

  // --- CROP ROTATION PLANS ---
  public getRotationPlans(farmerId?: string): CropRotationPlan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ROTATION_PLANS);
    const list: CropRotationPlan[] = raw ? JSON.parse(raw) : [];
    if (farmerId) {
      return list.filter((p) => p.farmerId === farmerId);
    }
    return list;
  }

  public saveRotationPlan(plan: CropRotationPlan) {
    const list = this.getRotationPlans();
    list.unshift(plan);
    localStorage.setItem(STORAGE_KEYS.ROTATION_PLANS, JSON.stringify(list));
    this.notify();
  }

  // --- CROP HEALTH CHECKS ---
  public getHealthChecks(farmerId?: string): CropHealthCheck[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_CHECKS);
    const list: CropHealthCheck[] = raw ? JSON.parse(raw) : [];
    if (farmerId) {
      return list.filter((c) => c.farmerId === farmerId);
    }
    return list;
  }

  public saveHealthCheck(check: CropHealthCheck) {
    const list = this.getHealthChecks();
    list.unshift(check);
    localStorage.setItem(STORAGE_KEYS.HEALTH_CHECKS, JSON.stringify(list));
    this.notify();
  }

  // --- PRODUCE MARKETPLACE ---
  public getProduceListings(): ProduceListing[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCE_LISTINGS);
    return raw ? JSON.parse(raw) : PRODUCE_LISTINGS;
  }

  public saveProduceListing(item: ProduceListing) {
    const list = this.getProduceListings();
    const idx = list.findIndex((p) => p.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCE_LISTINGS, JSON.stringify(list));
    this.notify();
  }

  public deleteProduceListing(id: string) {
    const list = this.getProduceListings().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCE_LISTINGS, JSON.stringify(list));
    this.notify();
  }

  public getProduceEnquiries(farmerId?: string): ProduceEnquiry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCE_ENQUIRIES);
    const list: ProduceEnquiry[] = raw ? JSON.parse(raw) : [];
    if (farmerId) {
      return list.filter((e) => e.farmerId === farmerId);
    }
    return list;
  }

  public submitProduceEnquiry(enquiry: ProduceEnquiry) {
    const list = this.getProduceEnquiries();
    list.unshift(enquiry);
    localStorage.setItem(STORAGE_KEYS.PRODUCE_ENQUIRIES, JSON.stringify(list));
    this.notify();
  }

  // --- GOVERNMENT SCHEMES ---
  public getSchemes(): GovernmentScheme[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEMES);
    return raw ? JSON.parse(raw) : GOVERNMENT_SCHEMES;
  }

  public saveScheme(scheme: GovernmentScheme) {
    const list = this.getSchemes();
    const idx = list.findIndex((s) => s.id === scheme.id);
    if (idx >= 0) {
      list[idx] = scheme;
    } else {
      list.unshift(scheme);
    }
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
    this.addAuditLog('UPDATED_SCHEME', scheme.name, `Scheme saved/updated by admin`);
    this.notify();
  }

  // --- TOURIST ENQUIRIES ---
  public getTouristEnquiries(filter?: { farmerId?: string; touristEmail?: string }): TouristEnquiry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TOURIST_ENQUIRIES);
    const list: TouristEnquiry[] = raw ? JSON.parse(raw) : INITIAL_TOURIST_ENQUIRIES;
    if (filter?.farmerId) {
      return list.filter((e) => e.farmerId === filter.farmerId);
    }
    if (filter?.touristEmail) {
      return list.filter((e) => e.touristEmail.toLowerCase() === filter.touristEmail?.toLowerCase());
    }
    return list;
  }

  public submitTouristEnquiry(enquiry: TouristEnquiry) {
    const list = this.getTouristEnquiries();
    list.unshift(enquiry);
    localStorage.setItem(STORAGE_KEYS.TOURIST_ENQUIRIES, JSON.stringify(list));
    this.notify();
  }

  public updateTouristEnquiryStatus(
    id: string,
    status: TouristEnquiry['status'],
    hostReplyMessage?: string
  ) {
    const list = this.getTouristEnquiries();
    const idx = list.findIndex((e) => e.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      if (hostReplyMessage) {
        list[idx].hostReplyMessage = hostReplyMessage;
      }
      localStorage.setItem(STORAGE_KEYS.TOURIST_ENQUIRIES, JSON.stringify(list));
      this.notify();
    }
  }

  // --- INFRASTRUCTURE REPORTS ---
  public getInfrastructureReports(): InfrastructureReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INFRA_REPORTS);
    return raw ? JSON.parse(raw) : INFRASTRUCTURE_REPORTS;
  }

  public submitInfrastructureReport(report: InfrastructureReport) {
    const list = this.getInfrastructureReports();
    list.unshift(report);
    localStorage.setItem(STORAGE_KEYS.INFRA_REPORTS, JSON.stringify(list));
    this.addAuditLog('REPORTED_INFRASTRUCTURE_GAP', report.title, `Category: ${report.category}, Village: ${report.village}`);
    this.notify();
  }

  public upvoteInfrastructureReport(id: string) {
    const list = this.getInfrastructureReports();
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx].supportVotesCount += 1;
      localStorage.setItem(STORAGE_KEYS.INFRA_REPORTS, JSON.stringify(list));
      this.notify();
    }
  }

  public updateInfrastructureReportStatus(
    id: string,
    status: InfrastructureReport['status'],
    assignedAuthority?: string,
    resolutionNotes?: string
  ) {
    const list = this.getInfrastructureReports();
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      if (assignedAuthority) list[idx].assignedAuthority = assignedAuthority;
      if (resolutionNotes) list[idx].resolutionNotes = resolutionNotes;
      localStorage.setItem(STORAGE_KEYS.INFRA_REPORTS, JSON.stringify(list));
      this.addAuditLog('UPDATED_INFRA_STATUS', list[idx].title, `New status: ${status}`);
      this.notify();
    }
  }

  // --- COMMUNITY BUSINESSES ---
  public getCommunityBusinesses(): CommunityBusiness[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return raw ? JSON.parse(raw) : COMMUNITY_BUSINESSES;
  }

  public saveCommunityBusiness(biz: CommunityBusiness) {
    const list = this.getCommunityBusinesses();
    const idx = list.findIndex((b) => b.id === biz.id);
    if (idx >= 0) {
      list[idx] = biz;
    } else {
      list.unshift(biz);
    }
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(list));
    this.notify();
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLogItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  }

  public addAuditLog(action: string, targetEntity: string, details: string) {
    const cur = this.getCurrentUser();
    const logs = this.getAuditLogs();
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
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  }

  // --- RESET ALL DATA ---
  public resetToDefaults() {
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
    this.notify();
  }
}

export const farmStore = new FarmBridgeStore();
