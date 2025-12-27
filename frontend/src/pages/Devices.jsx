import { useState, useEffect } from 'react';
import { devicesAPI } from '../api/api';
import './Devices.css';

function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'light',
    room: '',
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const res = await devicesAPI.getAll();
      setDevices(res.data);
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await devicesAPI.create(formData);
      setShowForm(false);
      setFormData({ name: '', type: 'light', room: '' });
      loadDevices();
    } catch (error) {
      console.error('Error creating device:', error);
      alert('Error creating device');
    }
  };

  const handleCommand = async (deviceId, command, payload) => {
    try {
      await devicesAPI.sendCommand(deviceId, command, payload);
      loadDevices();
    } catch (error) {
      console.error('Error sending command:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this device?')) return;
    try {
      await devicesAPI.delete(id);
      loadDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading devices...</div>;
  }

  return (
    <div className="devices">
      <div className="devices-header">
        <h1>Devices</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Device'}
        </button>
      </div>

      {showForm && (
        <form className="device-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Device Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="light">Light</option>
            <option value="thermostat">Thermostat</option>
            <option value="sensor">Sensor</option>
            <option value="lock">Lock</option>
          </select>
          <input
            type="text"
            placeholder="Room"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            required
          />
          <button type="submit">Create</button>
        </form>
      )}

      <div className="devices-grid">
        {devices.map((device) => (
          <div key={device.id} className="device-card">
            <div className="device-header">
              <h3>{device.name}</h3>
              <button
                className="delete-btn"
                onClick={() => handleDelete(device.id)}
              >
                ×
              </button>
            </div>
            <div className="device-info">
              <p><strong>Type:</strong> {device.type}</p>
              <p><strong>Room:</strong> {device.room}</p>
              <p><strong>State:</strong> {JSON.stringify(device.state || {})}</p>
            </div>
            <div className="device-actions">
              {device.type === 'light' && (
                <>
                  <button
                    onClick={() =>
                      handleCommand(device.id, 'set', {
                        on: !device.state?.on,
                      })
                    }
                  >
                    {device.state?.on ? 'Turn Off' : 'Turn On'}
                  </button>
                  <button
                    onClick={() =>
                      handleCommand(device.id, 'set', {
                        brightness: 80,
                      })
                    }
                  >
                    Set Brightness
                  </button>
                </>
              )}
              {device.type === 'thermostat' && (
                <button
                  onClick={() =>
                    handleCommand(device.id, 'set', { temperature: 22 })
                  }
                >
                  Set Temp 22°C
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Devices;

