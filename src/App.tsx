import { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/HeroBrand';
import { ImpactMatrix } from './components/ImpactMatrix';
import { LanguageProvider } from './context/LanguageContext';
import { FeedbackButton } from './components/FeedbackButton';
import { Login } from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useBusinesses } from './hooks/useBusinesses';
import { ToastContainer } from './components/Toast';
import { api } from './api/client';
import { Mail, Shield, Zap, AlertTriangle } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

// Lazy load feature components for better performance
const BusinessRegistration = lazy(() => import('./components/BusinessRegistration').then(m => ({ default: m.BusinessRegistration })));
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const MapExplorer = lazy(() => import('./components/MapExplorer').then(m => ({ default: m.MapExplorer })));
const CitizenReport = lazy(() => import('./components/CitizenReport').then(m => ({ default: m.CitizenReport })));
const QRScanner = lazy(() => import('./components/QRScanner').then(m => ({ default: m.QRScanner })));
const CitizenRegistration = lazy(() => import('./components/CitizenRegistration').then(m => ({ default: m.CitizenRegistration })));
const BlockchainExplorer = lazy(() => import('./components/BlockchainExplorer').then(m => ({ default: m.BlockchainExplorer })));
const PublicRegistry = lazy(() => import('./components/PublicRegistry').then(m => ({ default: m.PublicRegistry })));
const TechArchitecture = lazy(() => import('./components/TechArchitecture').then(m => ({ default: m.TechArchitecture })));
const HackathonJury = lazy(() => import('./components/HackathonJury').then(m => ({ default: m.HackathonJury })));
const DemoControls = lazy(() => import('./components/DemoControls').then(m => ({ default: m.DemoControls })));
const MerchantDashboard = lazy(() => import('./components/MerchantDashboard').then(m => ({ default: m.MerchantDashboard })));
const AIAssistant = lazy(() => import('./components/extensions/AIAssistant').then(m => ({ default: m.AIAssistant })));

const APP_VERSION = '1.1.0 (Senior Build)';

function LoadingFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-yellow-500/10 border-t-yellow-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-tighter">Loading Component...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const { businesses, reports, updateStatus, registerBusiness } = useBusinesses();
  
  const [currentView, setCurrentView] = useState('LOGIN');
  const [reportPrefill, setReportPrefill] = useState<string>('');
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  // Health check for backend
  useEffect(() => {
    const checkBackend = async () => {
      const isOnline = await api.checkHealth();
      if (!isOnline) {
        setIsBackendOffline(true);
      }
    };
    checkBackend();
  }, []);

  // View protection & Role-based routing
  useEffect(() => {
    if (user) {
      if (user.role === 'citizen' && (currentView === 'REGISTER' || currentView === 'DASHBOARD')) {
        setTimeout(() => setCurrentView('HOME'), 0);
      }
      if (user.role === 'business' && currentView === 'REPORT') {
        setTimeout(() => setCurrentView('HOME'), 0);
      }
    }
  }, [user, currentView]);

  // Clean implementation of cross-component triggers
  useEffect(() => {
    const handlers = {
      onReportBusiness: (name: string) => {
        setReportPrefill(name);
        setCurrentView('REPORT');
      },
      onOpenCitizenReg: () => {
        setCurrentView('REGISTER_CITIZEN');
      }
    };

    Object.assign(window, handlers);
    return () => {
      Object.keys(handlers).forEach(key => delete (window as any)[key]);
    };
  }, []);

  const handleLoginSuccess = (role: string) => {
    setCurrentView(role === 'citizen' ? 'HOME' : 'DASHBOARD');
  };

  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {(() => {
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
              return <BusinessRegistration onRegister={registerBusiness} businesses={businesses} />;
            case 'MAP':
              return <MapExplorer businesses={businesses} reports={reports} />;
            case 'REPORT':
              return <CitizenReport prefillName={reportPrefill} />;
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
              if (user?.role === 'business') {
                const business = businesses.find(b => b.id === user.id) || businesses[0];
                return <MerchantDashboard business={business} />;
              }
              return <Dashboard businesses={businesses} reports={reports} onUpdateStatus={updateStatus} />;
            default:
              return <Hero onRegister={() => setCurrentView('REGISTER')} onScan={() => setCurrentView('SCAN')} onCitizenRegister={() => setCurrentView('REGISTER_CITIZEN')} />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-yellow-500/30 pt-16">
      <ToastContainer />
      
      <div className="fixed top-16 left-0 w-full bg-yellow-500/90 text-slate-900 text-[10px] font-bold py-1 px-4 z-40 text-center tracking-widest uppercase">
        Enterprise Build – TrustReg TN Platform
      </div>

      {isBackendOffline && (
        <div className="fixed top-[4.5rem] left-0 w-full bg-red-600/90 text-white text-[10px] font-bold py-1 px-4 z-40 text-center tracking-widest uppercase flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="h-3 w-3" /> API Grid Offline — Check VITE_API_URL or run `npm run server`
        </div>
      )}

      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main>
        {authLoading ? (
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Verifying Identity...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      <AIAssistant />

      <footer className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="mb-4 text-slate-400 font-medium italic">"Scan once, know the truth."</p>
        <div className="flex justify-center space-x-6 mb-8">
          <a href="mailto:project.pilot@gmail.com" className="p-2.5 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-lg border border-slate-800" title="Email Us">
            <Mail className="h-5 w-5" />
          </a>
          <a href="#" className="p-2.5 bg-slate-900 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all shadow-lg border border-slate-800" title="View Source">
            <Shield className="h-5 w-5" />
          </a>
          <a href="#" className="p-2.5 bg-slate-900 rounded-full text-slate-400 hover:text-yellow-500 hover:bg-slate-800 transition-all shadow-lg border border-slate-800" title="Official Dashboard">
            <Zap className="h-5 w-5" />
          </a>
        </div>
        <p className="text-slate-500 text-sm mb-4">{t.footer.rights}</p>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 inline-block">
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-lg mx-auto uppercase tracking-tighter">
            <strong>DISCLAIMER:</strong> This is an <strong>enterprise research platform</strong> part of the TN-MBNR TrustReg TN Pilot.
            This is <strong>NOT</strong> an official service of the Government of Tamil Nadu.
          </p>
        </div>
        <p className="mt-4 text-[10px] text-slate-700">v{APP_VERSION}</p>
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
