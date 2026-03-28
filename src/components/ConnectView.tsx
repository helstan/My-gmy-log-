import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Watch, Bluetooth, Wifi, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const ConnectView: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);

  const startScan = () => {
    setIsScanning(true);
    setDevices([]);
    setTimeout(() => {
      setDevices([
        { id: '1', name: 'iPhone 15 Pro', type: 'phone', signal: 95 },
        { id: '2', name: 'Apple Watch Ultra', type: 'watch', signal: 82 },
        { id: '3', name: 'Garmin Fenix 7', type: 'watch', signal: 64 },
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const connectDevice = (name: string) => {
    setConnectedDevice(name);
    alert(`Successfully connected to ${name}!`);
  };

  return (
    <div className="space-y-8 px-1">
      <header>
        <div className="flex items-center gap-2 text-[var(--primary)] mb-1">
          <Bluetooth size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Connectivity</span>
        </div>
        <h2 className="text-3xl font-black text-[var(--text)] tracking-tight">Connect Devices</h2>
        <p className="text-sm text-[var(--text-muted)] font-bold">Sync your health data from your phone or fitness watch.</p>
      </header>

      <div className="gamified-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
              {isScanning ? <Loader2 size={24} className="animate-spin" /> : <Wifi size={24} />}
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--text)]">Nearby Devices</h3>
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Bluetooth & Wi-Fi Scan</p>
            </div>
          </div>
          <button 
            onClick={startScan}
            disabled={isScanning}
            className="bg-[var(--primary)] text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isScanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        <div className="space-y-3">
          {devices.length === 0 && !isScanning && (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-container)] flex items-center justify-center mx-auto text-[var(--outline)]">
                <Bluetooth size={32} />
              </div>
              <p className="text-sm text-[var(--text-muted)] font-bold">No devices found yet. Tap scan to begin.</p>
            </div>
          )}

          {devices.map((device) => (
            <motion.div 
              key={device.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="m3-card p-4 flex items-center justify-between group hover:border-[var(--primary)]/30 border border-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface-container)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">
                  {device.type === 'phone' ? <Smartphone size={20} /> : <Watch size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-[var(--text)]">{device.name}</h4>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Signal: {device.signal}%</p>
                </div>
              </div>
              <button 
                onClick={() => connectDevice(device.name)}
                className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  connectedDevice === device.name 
                    ? 'bg-[#34A853] text-white' 
                    : 'bg-[var(--surface-container)] text-[var(--text-muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                }`}
              >
                {connectedDevice === device.name ? 'Connected' : 'Connect'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] px-1">Why Connect?</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="gamified-card p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-[var(--text)]">Automatic Sync</h4>
              <p className="text-xs text-[var(--text-muted)] font-bold">Your workouts and steps will automatically sync to your profile.</p>
            </div>
          </div>
          <div className="gamified-card p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FBBC05]/10 text-[#FBBC05] flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-[var(--text)]">Real-time Heart Rate</h4>
              <p className="text-xs text-[var(--text-muted)] font-bold">Monitor your intensity during active workout sessions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
