// MainContent placeholder for Bandabets Platform
import PanelDashboard from './PanelDashboard';
import PanelBuilder from './PanelBuilder';
import PanelCreatives from './PanelCreatives';
import PanelAssets from './PanelAssets';
import PanelSchedule from './PanelSchedule';
import PanelAnalytics from './PanelAnalytics';
import BulkGenerate from './BulkGenerate';

export default function MainContent({ activePanel }) {
  return (
    <div className="main-content">
      <div style={{background:'#444',color:'#fff',padding:'4px',fontWeight:'bold'}}>MainContent.jsx loaded</div>
      {activePanel === 'dashboard' && <PanelDashboard />}
      {activePanel === 'builder' && <PanelBuilder />}
      {activePanel === 'creatives' && <PanelCreatives />}
      {activePanel === 'assets' && <PanelAssets />}
      {activePanel === 'schedule' && <PanelSchedule />}
      {activePanel === 'analytics' && <PanelAnalytics />}
      {activePanel === 'bulkgen' && <BulkGenerate />}
    </div>
  );
}
