import { useState, useEffect } from 'react';
import { devicesAPI, automationsAPI } from '../api/api';
import './Dashboard.css';

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [devicesRes, automationsRes] = await Promise.all([
        devicesAPI.getAll(),
        automationsAPI.getAll(),
      ]);
      setDevices(devicesRes.data);
      setAutomations(automationsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const activeDevices = devices.filter((d) => d.state?.on).length;
  const enabledAutomations = automations.filter((a) => a.enabled).length;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Devices</h3>
          <p className="stat-number">{devices.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Devices</h3>
          <p className="stat-number">{activeDevices}</p>
        </div>
        <div className="stat-card">
          <h3>Automations</h3>
          <p className="stat-number">{automations.length}</p>
        </div>
        <div className="stat-card">
          <h3>Enabled</h3>
          <p className="stat-number">{enabledAutomations}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <section>
          <h2>Recent Devices</h2>
          <div className="device-list">
            {devices.slice(0, 5).map((device) => (
              <div key={device.id} className="device-item">
                <div>
                  <strong>{device.name}</strong>
                  <span className="device-type">{device.type}</span>
                </div>
                <div className="device-state">
                  {device.state?.on ? '🟢 On' : '⚫ Off'}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Recent Automations</h2>
          <div className="automation-list">
            {automations.slice(0, 5).map((automation) => (
              <div key={automation.id} className="automation-item">
                <div>
                  <strong>{automation.name}</strong>
                  <span className={automation.enabled ? 'enabled' : 'disabled'}>
                    {automation.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

