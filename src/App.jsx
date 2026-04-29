import { useState } from 'react';
import './App.css';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  const [activePanel, setActivePanel] = useState('dashboard');

  // Navigation handler to be passed to Sidebar and Topbar
  const handlePanelSwitch = (panel) => setActivePanel(panel);

  return (
    <div style={{height:'100vh',display:'flex',flexDirection:'column'}}>
      <Topbar onPanelSwitch={handlePanelSwitch} />
      <div className="app-body">
        <Sidebar onPanelSwitch={handlePanelSwitch} activePanel={activePanel} />
        <MainContent activePanel={activePanel} />
      </div>
    </div>
  );
}

export default App;
