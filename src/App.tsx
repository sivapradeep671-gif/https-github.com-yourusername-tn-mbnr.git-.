import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ImpactMatrix } from './components/ImpactMatrix';
import { BusinessRegistration } from './components/BusinessRegistration';
import { MapExplorer } from './components/MapExplorer';
import { CitizenReport } from './components/CitizenReport';
import { QRScanner } from './components/QRScanner';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import type { Business } from './types/types';
import { LanguageProvider } from './context/LanguageContext';
import { FeedbackButton } from './components/FeedbackButton';
import { Mail, Twitter, Facebook, Instagram } from 'lucide-react';

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
  }
];



const APP_VERSION = '1.0.0';

function AppContent() {
  const [currentView, setCurrentView] = useState('HOME');
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinessData);

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
        setBusinesses(prev => [newBusiness, ...prev]);
        setCurrentView('HOME');
        alert("Business Registered Successfully!");
      } else {
        alert("Failed to register business. Please try again.");
      }
    } catch (error) {
      console.error("Error registering business:", error);
      setBusinesses(prev => [newBusiness, ...prev]);
      setCurrentView('HOME');
      alert("Business Registered (Demo Mode - Backend Unreachable)!");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <>
            <Hero onRegister={() => setCurrentView('REGISTER')} />
            <ImpactMatrix />
          </>
        );
      case 'REGISTER':
        return (
          <BusinessRegistration
            existingBusinesses={businesses}
            onRegister={handleRegister}
          />
        );
      case 'MAP':
        return <MapExplorer businesses={businesses} />;
      case 'REPORT':
        return <CitizenReport />;
      case 'SCAN':
        return <QRScanner />;
      case 'LEDGER':
        return <BlockchainExplorer />;
      default:
        return <Hero onRegister={() => setCurrentView('REGISTER')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-500/30">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main>
        {renderContent()}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-slate-500 text-sm">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="mailto:contact@tn-mbnr.gov.in" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all" title="Email Us">
            <Mail className="h-5 w-5" />
          </a>
          <a href="https://twitter.com/tn_mbnr" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all" title="Follow on Twitter">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://facebook.com/tn_mbnr" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-800 transition-all" title="Follow on Facebook">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="https://instagram.com/tn_mbnr" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-pink-500 hover:bg-slate-800 transition-all" title="Follow on Instagram">
            <Instagram className="h-5 w-5" />
          </a>
        </div>
        <p>© 2024 Tamil Nadu Municipal Business Name Revolution (TN-MBNR). All rights reserved.</p>
        <p className="mt-2 text-xs text-slate-600">v{APP_VERSION}</p>
      </footer>
      <FeedbackButton />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
