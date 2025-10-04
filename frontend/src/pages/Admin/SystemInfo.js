import React, { useState, useEffect } from 'react';
// DELETED: import { API_BASE_URL } from '../../utils/config';
import './SystemInfo.css';

// ADD: Mock system info data
const MOCK_SYSTEM_INFO = {
  application: {
    version: '1.0.0-DEMO',
    springBootVersion: '3.2.0',
    uptime: '2 zile, 5 ore',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('ro-RO')
  },
  memory: {
    heapUsed: '512 MB',
    heapCommitted: '1024 MB',
    heapMax: '2048 MB',
    heapPercentage: '25.0%',
    nonHeapUsed: '128 MB',
    nonHeapCommitted: '256 MB',
    nonHeapMax: '512 MB',
    pools: [
      { name: 'PS Eden Space', type: 'HEAP', used: '256 MB', max: '512 MB' },
      { name: 'PS Survivor Space', type: 'HEAP', used: '64 MB', max: '128 MB' },
      { name: 'PS Old Gen', type: 'HEAP', used: '192 MB', max: '1408 MB' },
      { name: 'Metaspace', type: 'NON_HEAP', used: '96 MB', max: 'N/A' },
      { name: 'Code Cache', type: 'NON_HEAP', used: '32 MB', max: '240 MB' }
    ]
  },
  database: {
    status: 'Connected',
    responseTime: '45ms',
    cursantCount: '8',
    announcementCount: '4',
    estimatedSize: '2.3 MB'
  },
  operatingSystem: {
    name: 'Windows 10',
    version: '10.0',
    architecture: 'amd64',
    availableProcessors: '8',
    systemCpuLoad: '35.2%',
    processCpuLoad: '12.5%',
    systemLoadAverage: '1.85',
    totalPhysicalMemory: '16 GB',
    freePhysicalMemory: '8.5 GB',
    totalSwapSpace: '4 GB',
    freeSwapSpace: '3.2 GB'
  },
  threads: {
    currentThreadCount: '42',
    daemonThreadCount: '38',
    peakThreadCount: '56',
    threadStates: {
      RUNNABLE: '12',
      WAITING: '18',
      TIMED_WAITING: '10',
      BLOCKED: '2'
    }
  },
  garbageCollection: {
    totalCollections: '1247',
    collectors: [
      { name: 'PS Scavenge', collectionCount: '1089', collectionTime: '2.5s' },
      { name: 'PS MarkSweep', collectionCount: '158', collectionTime: '5.2s' }
    ]
  },
  jvm: {
    javaVersion: '17.0.8',
    javaVendor: 'Oracle Corporation',
    jvmName: 'Java HotSpot(TM) 64-Bit Server VM',
    jvmVersion: '17.0.8+9-LTS-211'
  },
  network: {
    hostname: 'demo-server',
    hostAddress: '192.168.1.100',
    interfaces: [
      { name: 'eth0', mtu: '1500', addresses: ['192.168.1.100', 'fe80::1'] },
      { name: 'lo', mtu: '65536', addresses: ['127.0.0.1', '::1'] }
    ]
  },
  disk: {
    roots: [
      {
        path: 'C:\\',
        totalSpace: '500 GB',
        freeSpace: '250 GB',
        usableSpace: '245 GB',
        usagePercentage: '50.0%'
      }
    ],
    applicationDataSize: '156 MB',
    applicationFileCount: '2,847'
  }
};

const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // REPLACED: Fetch with mock data loading
  const fetchSystemInfo = () => {
    setLoading(true);
    
    setTimeout(() => {
      setSystemInfo(MOCK_SYSTEM_INFO);
      setError(null);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchSystemInfo();
    
    // Refresh system info every 30 seconds (mock - just updates timestamp)
    const interval = setInterval(() => {
      if (!loading) {
        setSystemInfo({ ...MOCK_SYSTEM_INFO });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value, thresholds) => {
    if (typeof value === 'string') {
      const numValue = parseFloat(value.replace('%', ''));
      if (numValue < thresholds.good) return 'good';
      if (numValue < thresholds.warning) return 'warning';
      return 'critical';
    }
    return 'normal';
  };

  const ProgressBar = ({ value, max, label, status }) => (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-label">{label}</span>
        <span className={`progress-value ${status}`}>{value}</span>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${status}`} 
          style={{ width: `${Math.min((parseFloat(value) / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  const MetricCard = ({ title, value, subtitle, status = 'normal', icon }) => (
    <div className={`metric-card ${status}`}>
      {icon && <div className="metric-icon">{icon}</div>}
      <div className="metric-content">
        <div className="metric-title">{title}</div>
        <div className={`metric-value ${status}`}>{value}</div>
        {subtitle && <div className="metric-subtitle">{subtitle}</div>}
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button 
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      <span className="tab-icon">{icon}</span>
      <span className="tab-label">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="system-info">
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <p>Se încarcă informațiile de sistem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="system-info error-state">
        <div className="system-header">
          <h2>Informații Sistem (Demo)</h2>
        </div>
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={fetchSystemInfo} className="retry-btn">
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="tab-content">
      <div className="metrics-grid">
        <MetricCard
          title="Versiune Aplicație"
          value={systemInfo.application?.version}
          subtitle={`Spring Boot ${systemInfo.application?.springBootVersion}`}
          icon="📱"
        />
        <MetricCard
          title="Timp Funcționare"
          value={systemInfo.application?.uptime}
          subtitle={`Start: ${systemInfo.application?.startTime}`}
          icon="⏱️"
        />
        <MetricCard
          title="Utilizare Memorie"
          value={systemInfo.memory?.heapPercentage}
          subtitle={`${systemInfo.memory?.heapUsed} / ${systemInfo.memory?.heapMax}`}
          status={getStatusColor(systemInfo.memory?.heapPercentage, { good: 60, warning: 80 })}
          icon="💾"
        />
        <MetricCard
          title="Baza de Date"
          value={systemInfo.database?.status}
          subtitle={`${systemInfo.database?.responseTime} | ${systemInfo.database?.cursantCount} înregistrări`}
          status={systemInfo.database?.status === 'Connected' ? 'good' : 'critical'}
          icon="🗄️"
        />
      </div>

      <div className="overview-sections">
        <div className="overview-section">
          <h3>Performanță Sistem</h3>
          <div className="performance-metrics">
            {systemInfo.operatingSystem?.systemCpuLoad && (
              <ProgressBar
                value={systemInfo.operatingSystem.systemCpuLoad}
                max={100}
                label="CPU Sistem"
                status={getStatusColor(systemInfo.operatingSystem.systemCpuLoad, { good: 50, warning: 80 })}
              />
            )}
            <ProgressBar
              value={systemInfo.memory?.heapPercentage}
              max={100}
              label="Memorie Heap"
              status={getStatusColor(systemInfo.memory?.heapPercentage, { good: 60, warning: 80 })}
            />
            {systemInfo.disk?.roots?.[0] && (
              <ProgressBar
                value={systemInfo.disk.roots[0].usagePercentage}
                max={100}
                label="Disk Principal"
                status={getStatusColor(systemInfo.disk.roots[0].usagePercentage, { good: 70, warning: 85 })}
              />
            )}
          </div>
        </div>

        <div className="overview-section">
          <h3>Activitate Recentă</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">🔄</span>
              <span>Ultima actualizare: {new Date().toLocaleTimeString('ro-RO')}</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🗃️</span>
              <span>Colectări GC: {systemInfo.garbageCollection?.totalCollections}</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🧵</span>
              <span>Thread-uri active: {systemInfo.threads?.currentThreadCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMemory = () => (
    <div className="tab-content">
      <div className="memory-overview">
        <div className="memory-section">
          <h3>Memorie Heap</h3>
          <div className="memory-details">
            <ProgressBar
              value={systemInfo.memory?.heapPercentage}
              max={100}
              label="Utilizare Heap"
              status={getStatusColor(systemInfo.memory?.heapPercentage, { good: 60, warning: 80 })}
            />
            <div className="memory-stats">
              <div className="memory-stat">
                <span className="stat-label">Utilizată:</span>
                <span className="stat-value">{systemInfo.memory?.heapUsed}</span>
              </div>
              <div className="memory-stat">
                <span className="stat-label">Alocată:</span>
                <span className="stat-value">{systemInfo.memory?.heapCommitted}</span>
              </div>
              <div className="memory-stat">
                <span className="stat-label">Maximă:</span>
                <span className="stat-value">{systemInfo.memory?.heapMax}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="memory-section">
          <h3>Memorie Non-Heap</h3>
          <div className="memory-stats">
            <div className="memory-stat">
              <span className="stat-label">Utilizată:</span>
              <span className="stat-value">{systemInfo.memory?.nonHeapUsed}</span>
            </div>
            <div className="memory-stat">
              <span className="stat-label">Alocată:</span>
              <span className="stat-value">{systemInfo.memory?.nonHeapCommitted}</span>
            </div>
            <div className="memory-stat">
              <span className="stat-label">Maximă:</span>
              <span className="stat-value">{systemInfo.memory?.nonHeapMax}</span>
            </div>
          </div>
        </div>
      </div>

      {systemInfo.memory?.pools && (
        <div className="memory-pools">
          <h3>Pool-uri de Memorie</h3>
          <div className="pools-grid">
            {systemInfo.memory.pools.map((pool, index) => (
              <div key={index} className="pool-card">
                <div className="pool-header">
                  <span className="pool-name">{pool.name}</span>
                  <span className={`pool-type ${pool.type.toLowerCase()}`}>{pool.type}</span>
                </div>
                <div className="pool-stats">
                  <div className="pool-stat">
                    <span>Utilizat: {pool.used}</span>
                  </div>
                  <div className="pool-stat">
                    <span>Maxim: {pool.max}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPerformance = () => (
    <div className="tab-content">
      <div className="performance-grid">
        <div className="performance-section">
          <h3>CPU & Sistem</h3>
          <div className="performance-metrics">
            {systemInfo.operatingSystem?.systemCpuLoad && (
              <MetricCard
                title="CPU Sistem"
                value={systemInfo.operatingSystem.systemCpuLoad}
                status={getStatusColor(systemInfo.operatingSystem.systemCpuLoad, { good: 50, warning: 80 })}
              />
            )}
            {systemInfo.operatingSystem?.processCpuLoad && (
              <MetricCard
                title="CPU Proces"
                value={systemInfo.operatingSystem.processCpuLoad}
                status={getStatusColor(systemInfo.operatingSystem.processCpuLoad, { good: 50, warning: 80 })}
              />
            )}
            {systemInfo.operatingSystem?.systemLoadAverage && (
              <MetricCard
                title="Load Average"
                value={systemInfo.operatingSystem.systemLoadAverage}
              />
            )}
          </div>
        </div>

        <div className="performance-section">
          <h3>Thread-uri</h3>
          <div className="thread-info">
            <div className="thread-stats">
              <MetricCard
                title="Thread-uri Curente"
                value={systemInfo.threads?.currentThreadCount}
              />
              <MetricCard
                title="Thread-uri Daemon"
                value={systemInfo.threads?.daemonThreadCount}
              />
              <MetricCard
                title="Vârf Thread-uri"
                value={systemInfo.threads?.peakThreadCount}
              />
            </div>
            {systemInfo.threads?.threadStates && (
              <div className="thread-states">
                <h4>Stări Thread-uri</h4>
                <div className="thread-states-grid">
                  {Object.entries(systemInfo.threads.threadStates).map(([state, count]) => (
                    <div key={state} className="thread-state">
                      <span className="state-name">{state}</span>
                      <span className="state-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="performance-section">
          <h3>Garbage Collection</h3>
          <div className="gc-info">
            {systemInfo.garbageCollection?.collectors && (
              <div className="gc-collectors">
                {systemInfo.garbageCollection.collectors.map((collector, index) => (
                  <div key={index} className="gc-collector">
                    <div className="gc-collector-header">
                      <span className="gc-name">{collector.name}</span>
                    </div>
                    <div className="gc-stats">
                      <div className="gc-stat">
                        <span>Colectări: {collector.collectionCount}</span>
                      </div>
                      <div className="gc-stat">
                        <span>Timp: {collector.collectionTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabase = () => (
    <div className="tab-content">
      <div className="database-overview">
        <div className="db-status-card">
          <div className="db-status-header">
            <h3>Status Conexiune</h3>
            <span className={`db-status-indicator ${systemInfo.database?.status === 'Connected' ? 'connected' : 'error'}`}>
              {systemInfo.database?.status === 'Connected' ? '🟢 Conectată' : '🔴 Eroare'}
            </span>
          </div>
          
          <div className="db-metrics">
            <MetricCard
              title="Timp Răspuns"
              value={systemInfo.database?.responseTime}
              status={systemInfo.database?.responseTime && parseInt(systemInfo.database.responseTime) < 100 ? 'good' : 
                     systemInfo.database?.responseTime && parseInt(systemInfo.database.responseTime) < 500 ? 'warning' : 'critical'}
            />
            <MetricCard
              title="Înregistrări Cursanți"
              value={systemInfo.database?.cursantCount}
            />
            <MetricCard
              title="Anunțuri"
              value={systemInfo.database?.announcementCount}
            />
            <MetricCard
              title="Mărime Estimată"
              value={systemInfo.database?.estimatedSize}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="tab-content">
      <div className="system-overview">
        <div className="system-section">
          <h3>Sistem de Operare</h3>
          <div className="system-details">
            <div className="system-info-grid">
              <div className="info-item">
                <span className="info-label">Nume:</span>
                <span className="info-value">{systemInfo.operatingSystem?.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Versiune:</span>
                <span className="info-value">{systemInfo.operatingSystem?.version}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Arhitectură:</span>
                <span className="info-value">{systemInfo.operatingSystem?.architecture}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Procesoare:</span>
                <span className="info-value">{systemInfo.operatingSystem?.availableProcessors}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="system-section">
          <h3>Java Virtual Machine</h3>
          <div className="jvm-details">
            <div className="system-info-grid">
              <div className="info-item">
                <span className="info-label">Versiune Java:</span>
                <span className="info-value">{systemInfo.jvm?.javaVersion}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vendor:</span>
                <span className="info-value">{systemInfo.jvm?.javaVendor}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nume JVM:</span>
                <span className="info-value">{systemInfo.jvm?.jvmName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Versiune JVM:</span>
                <span className="info-value">{systemInfo.jvm?.jvmVersion}</span>
              </div>
            </div>
          </div>
        </div>

        {systemInfo.operatingSystem?.totalPhysicalMemory && (
          <div className="system-section">
            <h3>Resurse Fizice</h3>
            <div className="resource-metrics">
              <MetricCard
                title="Memorie Fizică Totală"
                value={systemInfo.operatingSystem.totalPhysicalMemory}
              />
              <MetricCard
                title="Memorie Fizică Liberă"
                value={systemInfo.operatingSystem.freePhysicalMemory}
              />
              <MetricCard
                title="Swap Total"
                value={systemInfo.operatingSystem.totalSwapSpace}
              />
              <MetricCard
                title="Swap Liber"
                value={systemInfo.operatingSystem.freeSwapSpace}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="tab-content">
      <div className="network-overview">
        <div className="network-basic">
          <h3>Informații de Bază</h3>
          <div className="network-basic-info">
            <MetricCard
              title="Hostname"
              value={systemInfo.network?.hostname || 'N/A'}
            />
            <MetricCard
              title="Adresă IP"
              value={systemInfo.network?.hostAddress || 'N/A'}
            />
          </div>
        </div>

        {systemInfo.network?.interfaces && (
          <div className="network-interfaces">
            <h3>Interfețe de Rețea</h3>
            <div className="interfaces-grid">
              {systemInfo.network.interfaces.map((networkInterface, index) => (
                <div key={index} className="interface-card">
                  <div className="interface-header">
                    <span className="interface-name">{networkInterface.name}</span>
                    <span className="interface-mtu">MTU: {networkInterface.mtu}</span>
                  </div>
                  <div className="interface-addresses">
                    {networkInterface.addresses.map((address, addrIndex) => (
                      <span key={addrIndex} className="interface-address">{address}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDisk = () => (
    <div className="tab-content">
      <div className="disk-overview">
        {systemInfo.disk?.roots && (
          <div className="disk-roots">
            <h3>Volume Disk</h3>
            <div className="disk-roots-grid">
              {systemInfo.disk.roots.map((root, index) => (
                <div key={index} className="disk-root-card">
                  <div className="disk-root-header">
                    <span className="disk-path">{root.path}</span>
                    <span className={`disk-usage ${getStatusColor(root.usagePercentage, { good: 70, warning: 85 })}`}>
                      {root.usagePercentage}
                    </span>
                  </div>
                  
                  <ProgressBar
                    value={root.usagePercentage}
                    max={100}
                    label="Utilizare"
                    status={getStatusColor(root.usagePercentage, { good: 70, warning: 85 })}
                  />
                  
                  <div className="disk-details">
                    <div className="disk-stat">
                      <span className="stat-label">Total:</span>
                      <span className="stat-value">{root.totalSpace}</span>
                    </div>
                    <div className="disk-stat">
                      <span className="stat-label">Liber:</span>
                      <span className="stat-value">{root.freeSpace}</span>
                    </div>
                    <div className="disk-stat">
                      <span className="stat-label">Utilizabil:</span>
                      <span className="stat-value">{root.usableSpace}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {systemInfo.disk?.applicationDataSize && (
          <div className="application-disk">
            <h3>Date Aplicație</h3>
            <div className="app-disk-metrics">
              <MetricCard
                title="Mărime Date"
                value={systemInfo.disk.applicationDataSize}
                icon="📁"
              />
              <MetricCard
                title="Număr Fișiere"
                value={systemInfo.disk.applicationFileCount}
                icon="📄"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="system-info">
      <div className="system-header">
        <h2>Informații Sistem (Demo)</h2>
        <div className="header-actions">
          {loading ? (
            <div className="system-loading">Se actualizează...</div>
          ) : (
            <div className="last-update">
              Ultima actualizare: {new Date().toLocaleTimeString('ro-RO')}
            </div>
          )}
          <button onClick={fetchSystemInfo} className="refresh-btn" disabled={loading}>
            {loading ? 'Se actualizează...' : 'Actualizează'}
          </button>
        </div>
      </div>

      <div className="system-tabs">
        <TabButton id="overview" label="Prezentare Generală" icon="📊" isActive={activeTab === 'overview'} onClick={setActiveTab} />
        <TabButton id="memory" label="Memorie" icon="💾" isActive={activeTab === 'memory'} onClick={setActiveTab} />
        <TabButton id="performance" label="Performanță" icon="⚡" isActive={activeTab === 'performance'} onClick={setActiveTab} />
        <TabButton id="database" label="Baza de Date" icon="🗄️" isActive={activeTab === 'database'} onClick={setActiveTab} />
        <TabButton id="system" label="Sistem" icon="🖥️" isActive={activeTab === 'system'} onClick={setActiveTab} />
        <TabButton id="network" label="Rețea" icon="🌐" isActive={activeTab === 'network'} onClick={setActiveTab} />
        <TabButton id="disk" label="Disk" icon="💿" isActive={activeTab === 'disk'} onClick={setActiveTab} />
      </div>

      <div className="system-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'memory' && renderMemory()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'database' && renderDatabase()}
        {activeTab === 'system' && renderSystem()}
        {activeTab === 'network' && renderNetwork()}
        {activeTab === 'disk' && renderDisk()}
      </div>
    </div>
  );
};

export default SystemInfo;