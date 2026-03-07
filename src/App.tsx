import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/HeroBrand';
import { ImpactMatrix } from './components/ImpactMatrix';
import { BusinessRegistration } from './components/BusinessRegistration';
import { MapExplorer } from './components/MapExplorer';
import { CitizenReport } from './components/CitizenReport';
import { QRScanner } from './components/QRScanner';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { TechArchitecture } from './components/TechArchitecture';
import { HackathonJury } from './components/HackathonJury';
import type { Business } from './types/types';
import { LanguageProvider } from './context/LanguageContext';
import { FeedbackButton } from './components/FeedbackButton';
import { Login } from './components/Login';         // NEW
import { Dashboard } from './components/Dashboard'; // NEW
import { DemoControls } from './components/DemoControls'; // NEW
import { CitizenRegistration } from './components/CitizenRegistration'; // NEW
import { PublicRegistry } from './components/PublicRegistry'; // NEW
import { AuthProvider } from './context/AuthContext'; // NEW
import { Mail, Shield, Zap, AlertTriangle } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const mockBusinessData: Business[] = [
  {
    id: '1',
    legalName: 'Sri Krishna Sweets Pvt Ltd',
    tradeName: 'Sri Krishna Sweets',
    type: 'Private Limited',
    address: '123, M.G. Road, Adyar, Chennai',
    branchName: 'Adyar Branch',
    contactNumber: '9876543210',
    email: 'contact@srikrishnasweets.com',
    status: 'Verified',
    registrationDate: '2023-01-15',
    riskScore: 5,
    category: 'Food & Beverage',
    coordinates: { lat: 13.0067, lng: 80.2496 }
  },
  {
    id: '2',
    legalName: 'A2B Adyar Ananda Bhavan',
    tradeName: 'A2B',
    type: 'Private Limited',
    address: '45, Anna Salai, T. Nagar, Chennai',
    branchName: 'T. Nagar Branch',
    contactNumber: '9876543211',
    email: 'info@a2b.com',
    status: 'Verified',
    registrationDate: '2023-02-20',
    riskScore: 2,
    category: 'Food & Beverage',
    coordinates: { lat: 13.0418, lng: 80.2341 }
  },
  {
    id: 'KPN-TVL-001',
    legalName: 'KPN Travels India Pvt Ltd',
    tradeName: 'KPN Travels',
    type: 'Private Limited',
    address: '12, Omni Bus Stand, Koyambedu, Chennai',
    branchName: 'Head Office',
    contactNumber: '044-24791111',
    email: 'bookings@kpntravels.in',
    status: 'Verified',
    registrationDate: '2022-05-10',
    riskScore: 3,
    category: 'Transportation',
    coordinates: { lat: 13.0694, lng: 80.1914 }
  }
];



const APP_VERSION = '1.0.0';

import { useLanguage } from './context/LanguageContext';

function AppContent() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState('LOGIN');
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinessData);
  const [citizenReports, setCitizenReports] = useState<any[]>([]);
  const [reportPrefill, setReportPrefill] = useState<string>('');
  const { user } = useAuth();
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/businesses'); // Simple health check
        if (!res.ok) setIsBackendOffline(true);
      } catch (e) {
        setIsBackendOffline(true);
      }
    };
    checkBackend();
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('/api/businesses');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.data)) {
            setBusinesses(data.data);
          }
        } else {
          console.warn("Failed to fetch businesses from API, falling back to mock data.");
          setBusinesses(mockBusinessData);
        }
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
        setBusinesses(mockBusinessData);
      }
    };

    fetchBusinesses();
  }, []);

  // Effect to handle view protection (Replaces dangerous in-render state updates)
  useEffect(() => {
    if (user?.role === 'citizen' && (currentView === 'REGISTER' || currentView === 'DASHBOARD')) {
      setCurrentView('HOME');
    }
    if (user?.role === 'business' && currentView === 'REPORT') {
      setCurrentView('HOME');
    }
  }, [user, currentView]);

  const handleRegister = async (newBusiness: Business) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBusiness),
      });

      if (response.ok) {
        const result = await response.json();
        const verifiedBusiness = result.data || newBusiness;
        setBusinesses(prev => [verifiedBusiness, ...prev]);
        setCurrentView('HOME');
        alert(`Business Registered Successfully!\nVerified ID: ${verifiedBusiness.certificateId || 'Pending'}`);
      } else {
        throw new Error("API responded with error");
      }
    } catch (error) {
      console.error("Error registering business:", error);
      setBusinesses(prev => [newBusiness, ...prev]);
      setCurrentView('HOME');
      alert("Business Registered (Offline/Demo Mode)!");
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'Verified' | 'Rejected') => {
    setBusinesses(prev => prev.map(b =>
      b.id === id ? { ...b, status: newStatus } : b
    ));
  };

  const handleReport = async (formData: any) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData, // Auto-sets Content-Type to multipart/form-data
      });

      if (response.ok) {
        setCitizenReports(prev => [
          {
            ...Object.fromEntries(formData),
            id: `REP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            status: 'Submitted',
            timestamp: new Date().toISOString(),
          },
          ...prev
        ]);
        alert("Thank you! Your report has been submitted to the authorities.");
        setReportPrefill('');
        setCurrentView('HOME');
      } else {
        throw new Error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  // Expose triggers for child components
  useEffect(() => {
    (window as any).onReportBusiness = (name: string) => {
      setReportPrefill(name);
      setCurrentView('REPORT');
    };
    (window as any).onOpenCitizenReg = () => {
      setCurrentView('REGISTER_CITIZEN');
    };
    return () => {
      delete (window as any).onReportBusiness;
      delete (window as any).onOpenCitizenReg;
    };
  }, []);

  const handleLoginSuccess = (role: string) => {
    if (role === 'citizen') {
      setCurrentView('HOME');
    } else {
      setCurrentView('DASHBOARD');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <>
            <Hero
              onRegister={() => setCurrentView('REGISTER')}
              onScan={() => setCurrentView('SCAN')}
              onCitizenRegister={() => setCurrentView('REGISTER_CITIZEN')}
            />
            <ImpactMatrix />
            <HackathonJury />
            <TechArchitecture />
          </>
        );
      case 'REGISTER':
        return (
          <BusinessRegistration
            onRegister={handleRegister}
            businesses={businesses}
          />
        );
      case 'MAP':
        return <MapExplorer businesses={businesses} />;
      case 'REPORT':
        return <CitizenReport onReport={handleReport} prefillName={reportPrefill} />;
      case 'SCAN':
        return <QRScanner businesses={businesses} />;
      case 'REGISTER_CITIZEN':
        return <CitizenRegistration onComplete={() => setCurrentView('HOME')} />;
      case 'LEDGER':
        return <BlockchainExplorer businesses={businesses} />;
      case 'REGISTRY':
        return <PublicRegistry businesses={businesses} />;
      case 'LOGIN':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'DASHBOARD':
        return (
          <Dashboard
            businesses={businesses}
            reports={citizenReports}
            onUpdateStatus={handleUpdateStatus}
          />
        );
      default:
        return (
          <Hero
            onRegister={() => setCurrentView('REGISTER')}
            onScan={() => setCurrentView('SCAN')}
            onCitizenRegister={() => setCurrentView('REGISTER_CITIZEN')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-500/30 pt-16">
      <div className="fixed top-16 left-0 w-full bg-yellow-500/90 text-slate-900 text-[10px] font-bold py-1 px-4 z-40 text-center tracking-widest uppercase">
        Simulation Prototype – TrustReg TN Pilot Phase
      </div>
      {isBackendOffline && (
        <div className="fixed top-[4.5rem] left-0 w-full bg-red-600/90 text-white text-[10px] font-bold py-1 px-4 z-40 text-center tracking-widest uppercase flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="h-3 w-3" /> Service Unavailable - Backend Offline
        </div>
      )}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main>
        {renderContent()}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="mb-4 text-slate-400 font-medium italic">"Scan once, know the truth."</p>
        <div className="flex justify-center space-x-6 mb-8">
          <a href="mailto:project.pilot@gmail.com" className="p-2.5 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-lg border border-slate-800" title="Email Us">
            <Mail className="h-5 w-5" />
          </a>
          <a href="https://github.com/sivapradeep671-gif/https-github.com-yourusername-tn-mbnr.git-./" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all shadow-lg border border-slate-800" title="View Source">
            <Shield className="h-5 w-5" />
          </a>
          <a href="#" className="p-2.5 bg-slate-900 rounded-full text-slate-400 hover:text-yellow-500 hover:bg-slate-800 transition-all shadow-lg border border-slate-800" title="Official Dashboard">
            <Zap className="h-5 w-5" />
          </a>
        </div>
        <p className="text-slate-500 text-sm mb-4">{t.footer.rights}</p>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 inline-block">
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-lg mx-auto uppercase tracking-tighter">
            <strong>DISCLAIMER:</strong> This is a <strong>student research prototype</strong> part of the TN-MBNR TrustReg TN Pilot.
            This is <strong>NOT</strong> an official service of the Government of Tamil Nadu.
          </p>
        </div>
        <p className="mt-4 text-[10px] text-slate-700">v{APP_VERSION} • Prototype Build</p>
      </footer>
      <FeedbackButton />
      <DemoControls />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
