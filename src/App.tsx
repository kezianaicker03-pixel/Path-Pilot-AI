import React, { useState } from 'react';
import { StudentProvider, useStudent } from './context/StudentContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/Landing/LandingPage';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';
import { DashboardView } from './components/Dashboard/DashboardView';
import { CareerMatchesView } from './components/Careers/CareerMatchesView';
import { CareerDetailModal } from './components/Careers/CareerDetailModal';
import { CareerCompareModal } from './components/Careers/CareerCompareModal';
import { ShareProfileModal } from './components/Careers/ShareProfileModal';
import { UniversitySearchView } from './components/Universities/UniversitySearchView';
import { UniversityCompareModal } from './components/Universities/UniversityCompareModal';
import { WhatIfSimulator } from './components/Academic/WhatIfSimulator';
import { AcademicGamePlanView } from './components/Academic/AcademicGamePlanView';
import { ApplicationPlannerView } from './components/Planner/ApplicationPlannerView';
import { FundingView } from './components/Funding/FundingView';
import { SavedItemsView } from './components/Saved/SavedItemsView';
import { AskPilotDrawer } from './components/Chat/AskPilotDrawer';
import { PrivacyModal } from './components/PrivacyModal';
import { FinalReportView } from './components/Report/FinalReportView';
import { NewAssessmentModal } from './components/Academics/NewAssessmentModal';
import { EditAcademicModal } from './components/Academics/EditAcademicModal';
import { Career, UniversityProgramme } from './types';

const MainAppContent: React.FC = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    selectedCareer,
    setSelectedCareer,
    selectedProgramme,
    setSelectedProgramme,
  } = useStudent();

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [compareCareers, setCompareCareers] = useState<Career[]>([]);
  const [compareUniversities, setCompareUniversities] = useState<UniversityProgramme[]>([]);

  const handleSelectCareer = (career: Career) => {
    setSelectedCareer(career);
  };

  const handleSelectProgramme = (programme: UniversityProgramme) => {
    setSelectedProgramme(programme);
  };

  const handleFindUniversitiesForCareer = (career: Career) => {
    setSelectedCareer(null);
    setActiveTab('universities');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 xl:pb-12">
        {/* If no profile and on landing tab, show Landing Page */}
        {(!profile || activeTab === 'landing') && activeTab !== 'onboarding' && activeTab !== 'report' ? (
          <LandingPage />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            {activeTab === 'report' && <FinalReportView />}
            {activeTab === 'onboarding' && <OnboardingWizard />}
            {activeTab === 'discover' && <OnboardingWizard />}
            {activeTab === 'dashboard' && (
              <DashboardView onOpenShareModal={() => setIsShareOpen(true)} />
            )}
            {activeTab === 'careers' && (
              <CareerMatchesView
                onSelectCareer={handleSelectCareer}
                onOpenCompare={(careers) => setCompareCareers(careers)}
              />
            )}
            {activeTab === 'universities' && (
              <UniversitySearchView
                onSelectProgramme={handleSelectProgramme}
                onOpenCompare={(progs) => setCompareUniversities(progs)}
              />
            )}
            {activeTab === 'what-if' && <WhatIfSimulator />}
            {activeTab === 'roadmap' && <AcademicGamePlanView />}
            {activeTab === 'planner' && <ApplicationPlannerView />}
            {activeTab === 'funding' && <FundingView />}
            {activeTab === 'saved' && (
              <SavedItemsView
                onSelectCareer={handleSelectCareer}
                onSelectProgramme={handleSelectProgramme}
              />
            )}
          </div>
        )}
      </main>

      {/* New Assessment Confirmation Modal */}
      <NewAssessmentModal />

      {/* Edit Academic Profile Modal */}
      <EditAcademicModal />

      {/* Career Detail Modal */}
      {selectedCareer && (
        <CareerDetailModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
          onFindUniversities={handleFindUniversitiesForCareer}
        />
      )}

      {/* Career Compare Modal */}
      {compareCareers.length > 0 && (
        <CareerCompareModal
          careers={compareCareers}
          onClose={() => setCompareCareers([])}
          onSelectCareer={(c) => {
            setCompareCareers([]);
            setSelectedCareer(c);
          }}
        />
      )}

      {/* University Compare Modal */}
      {compareUniversities.length > 0 && (
        <UniversityCompareModal
          programmes={compareUniversities}
          onClose={() => setCompareUniversities([])}
        />
      )}

      {/* Share Profile Modal */}
      {isShareOpen && <ShareProfileModal onClose={() => setIsShareOpen(false)} />}

      {/* Privacy & Settings Modal */}
      {isPrivacyOpen && <PrivacyModal onClose={() => setIsPrivacyOpen(false)} />}

      {/* Ask Pilot Floating Drawer */}
      <AskPilotDrawer />
    </div>
  );
};

export function App() {
  return (
    <StudentProvider>
      <MainAppContent />
    </StudentProvider>
  );
}

export default App;
