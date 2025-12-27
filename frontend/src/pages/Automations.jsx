import { useState, useEffect } from 'react';
import { automationsAPI, devicesAPI } from '../api/api';
import './Automations.css';

function Automations() {
  const [automations, setAutomations] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    trigger: { type: 'time', value: '18:00' },
    actions: [{ deviceId: '', command: {} }],
    enabled: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [automationsRes, devicesRes] = await Promise.all([
        automationsAPI.getAll(),
        devicesAPI.getAll(),
      ]);
      setAutomations(automationsRes.data);
      setDevices(devicesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await automationsAPI.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        trigger: { type: 'time', value: '18:00' },
        actions: [{ deviceId: '', command: {} }],
        enabled: true,
      });
      loadData();
    } catch (error) {
      console.error('Error creating automation:', error);
      alert('Error creating automation');
    }
  };

  const handleToggle = async (id, enabled) => {
    try {
      await automationsAPI.update(id, { enabled: !enabled });
      loadData();
    } catch (error) {
      console.error('Error updating automation:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this automation?')) return;
    try {
      await automationsAPI.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting automation:', error);
    }
  };

  const handleExecute = async (id) => {
    try {
      await automationsAPI.execute(id);
      alert('Automation executed');
    } catch (error) {
      console.error('Error executing automation:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading automations...</div>;
  }

  return (
    <div className="automations">
      <div className="automations-header">
        <h1>Automations</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create Automation'}
        </button>
      </div>

      {showForm && (
        <form className="automation-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Automation Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div>
            <label>Trigger Type: Time</label>
            <input
              type="time"
              value={formData.trigger.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trigger: { ...formData.trigger, value: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label>Action Device</label>
            <select
              value={formData.actions[0].deviceId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  actions: [
                    {
                      ...formData.actions[0],
                      deviceId: e.target.value,
                    },
                  ],
                })
              }
            >
              <option value="">Select device</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Command (JSON)</label>
            <input
              type="text"
              placeholder='{"on": true}'
              onChange={(e) => {
                try {
                  const command = JSON.parse(e.target.value);
                  setFormData({
                    ...formData,
                    actions: [{ ...formData.actions[0], command }],
                  });
                } catch {}
              }}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      )}

      <div className="automations-list">
        {automations.map((automation) => (
          <div key={automation.id} className="automation-card">
            <div className="automation-header">
              <h3>{automation.name}</h3>
              <div className="automation-status">
                <span className={automation.enabled ? 'enabled' : 'disabled'}>
                  {automation.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  onClick={() => handleToggle(automation.id, automation.enabled)}
                >
                  {automation.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
            <div className="automation-info">
              <p><strong>Trigger:</strong> {JSON.stringify(automation.trigger)}</p>
              <p><strong>Actions:</strong> {automation.actions.length}</p>
            </div>
            <div className="automation-actions">
              <button onClick={() => handleExecute(automation.id)}>
                Execute Now
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(automation.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Automations;

