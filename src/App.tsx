import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, Language } from './types';
import { farmStore } from './services/store';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { SoilAnalysisWorkspace } from './components/farmer/SoilAnalysisWorkspace';
import { CropSuitabilityEngine } from './components/farmer/CropSuitabilityEngine';
import { CropRotationPlanner } from './components/farmer/CropRotationPlanner';
import { CropHealthAssistant } from './components/farmer/CropHealthAssistant';
import { ProfitCalculator } from './components/farmer/ProfitCalculator';
import { MarketInformation } from './components/farmer/MarketInformation';
import { SchemeFinder } from './components/farmer/SchemeFinder';
import { KnowledgeAssistant } from './components/farmer/KnowledgeAssistant';
import { FarmStayRegistration } from './components/farmstay/FarmStayRegistration';
import { ReadinessAssessment } from './components/farmstay/ReadinessAssessment';
import { ImprovementPlanner } from './components/farmstay/ImprovementPlanner';
import { TouristSearch } from './components/tourist/TouristSearch';
import { FarmStayDetails } from './components/tourist/FarmStayDetails';
import { TouristEnquiries } from './components/tourist/TouristEnquiries';
import { ProduceMarketplace } from './components/marketplace/ProduceMarketplace';
import { InfrastructureGapReporter } from './components/community/InfrastructureGapReporter';
import { CommunityDirectory } from './components/community/CommunityDirectory';
import { CommunityImpactDashboard } from './components/community/CommunityImpactDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => farmStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedFarmStayId, setSelectedFarmStayId] = useState<string>('fs_1');

  // Sync state when store changes
  useEffect(() => {
    const unsubscribe = farmStore.subscribe(() => {
      setCurrentUser(farmStore.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  const handleSwitchRole = (role: UserRole) => {
    farmStore.switchRole(role);
    const updated = farmStore.getCurrentUser();
    setCurrentUser(updated);

    // Contextual routing when role switches
    if (role === 'farmer') {
      setActiveTab('farmer_dashboard');
    } else if (role === 'tourist') {
      setActiveTab('tourist_search');
    } else if (role === 'community_manager') {
      setActiveTab('community_hub');
    } else if (role === 'administrator') {
      setActiveTab('admin_dashboard');
    }
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data to default clean state? This will clear local edits.')) {
      farmStore.resetToDefaults();
      setCurrentUser(farmStore.getCurrentUser());
      setActiveTab('landing');
    }
  };

  const handleSelectFarmStay = (id: string) => {
    setSelectedFarmStayId(id);
    setActiveTab('farmstay_details');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      <Navbar
        currentUser={currentUser}
        currentRole={currentUser.role}
        language={language}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSwitchRole={handleSwitchRole}
        onToggleLanguage={handleToggleLanguage}
        onResetData={handleResetData}
      />

      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            language={language}
            onSelectTab={setActiveTab}
            onSwitchRole={handleSwitchRole}
          />
        )}

        {/* Farmer Assistance Modules */}
        {activeTab === 'farmer_dashboard' && (
          <FarmerDashboard
            currentUser={currentUser}
            language={language}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'soil_analysis' && (
          <SoilAnalysisWorkspace currentUser={currentUser} />
        )}
        {activeTab === 'crop_suitability' && (
          <CropSuitabilityEngine
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'crop_rotation' && (
          <CropRotationPlanner currentUser={currentUser} />
        )}
        {activeTab === 'crop_profit' && (
          <ProfitCalculator currentUser={currentUser} />
        )}
        {activeTab === 'crop_health' && (
          <CropHealthAssistant currentUser={currentUser} />
        )}
        {activeTab === 'market_data' && (
          <MarketInformation currentUser={currentUser} />
        )}
        {activeTab === 'govt_schemes' && (
          <SchemeFinder currentUser={currentUser} />
        )}
        {activeTab === 'knowledge_assistant' && (
          <KnowledgeAssistant />
        )}

        {/* Agritourism & Farm-Stay Modules */}
        {activeTab === 'farmstay_register' && (
          <FarmStayRegistration
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'farmstay_readiness' && (
          <ReadinessAssessment
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'improvement_planner' && (
          <ImprovementPlanner
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        )}

        {/* Tourist Discovery & Enquiries */}
        {activeTab === 'tourist_search' && (
          <TouristSearch
            currentUser={currentUser}
            onSelectFarmStay={handleSelectFarmStay}
          />
        )}
        {activeTab === 'farmstay_details' && (
          <FarmStayDetails
            farmStayId={selectedFarmStayId}
            currentUser={currentUser}
            onBack={() => setActiveTab('tourist_search')}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'tourist_enquiries' && (
          <TouristEnquiries
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        )}

        {/* Direct Produce Marketplace */}
        {activeTab === 'marketplace' && (
          <ProduceMarketplace currentUser={currentUser} />
        )}

        {/* Community & Rural Infrastructure */}
        {activeTab === 'infra_gap_reports' && (
          <InfrastructureGapReporter currentUser={currentUser} />
        )}
        {activeTab === 'community_directory' && (
          <CommunityDirectory currentUser={currentUser} />
        )}
        {activeTab === 'community_hub' && (
          <CommunityImpactDashboard onSelectTab={setActiveTab} />
        )}

        {/* Administration & Verification */}
        {activeTab === 'admin_dashboard' && (
          <AdminDashboard
            currentUser={currentUser}
            onSelectTab={setActiveTab}
          />
        )}
      </main>

      <Footer language={language} onSelectTab={setActiveTab} />
    </div>
  );
}
