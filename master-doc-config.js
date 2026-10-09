const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// no-dd-sa:javascript-inclusive/declarations
const masterConfigPath = 'master_config.json';
const CONFIG = {
  MASTER_CONFIG_URL: parseDocConfigUrl('--configUrl='),
  TEAM_INFO: {
    podNumber: 22,
    moduleName: 'B2B SCE',
    sdmName: 'Prakash Shelar',
    taName: 'Rahul Kalsha',
    paName: 'Sarbjot Singh'
  },
  // no-dd-sa:javascript-code-style/method-name
  get MODULE_ID() {
    return `${this.TEAM_INFO.podNumber}_${this.TEAM_INFO.moduleName.toLowerCase().replace(/\s+/g, '_')}`;
  }
};

function getCurrentTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const period = now.getHours() >= 12 ? 'PM' : 'AM';
  const displayHours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${String(displayHours).padStart(2, '0')}:${minutes} ${period}`;
}

function parseDocConfigUrl(argName) {
  const args = process.argv;
  const docUrlArg = args.find(arg => arg.startsWith(argName));
  if (docUrlArg) {
    return docUrlArg.split('=')[1].replace(/['"]/g, '');
  }
  return docUrlArg;
}

// no-dd-sa:javascript-inclusive/declarations
function fetchMasterConfig() {
  // Only use local file, do not call API
  if (fs.existsSync(masterConfigPath)) {
    try {
      // no-dd-sa:javascript-node-security/detect-non-literal-fs-filename
      const localData = JSON.parse(fs.readFileSync(masterConfigPath, 'utf8'));
      return Array.isArray(localData) ? localData : [];
    } catch (localError) {
      // No local data available
    }
  }
  // Create empty file if nothing else works
  fs.writeFileSync(masterConfigPath, JSON.stringify([], null, 2));
  return [];
}

// no-dd-sa:javascript-inclusive/formal-parameters
function updateConfig(masterConfig, docUrl, timestamp) {
  const moduleId = CONFIG.MODULE_ID;
  const moduleName = CONFIG.TEAM_INFO.moduleName;
  const newDocEntry = { dateTimeStamp: timestamp, docLink: docUrl };

  // Always replace the config with only the current module entry
  const updatedConfig = [
    {
      id: moduleId,
      moduleName,
      sdmName: CONFIG.TEAM_INFO.sdmName,
      taName: CONFIG.TEAM_INFO.taName,
      paName: CONFIG.TEAM_INFO.paName,
      docList: [newDocEntry]
    }
  ];
  return { updatedConfig, wasUpdated: true };
}

// no-dd-sa:javascript-inclusive/declarations
function saveToMasterDoc(updatedConfig) {
  // no-dd-sa:javascript-inclusive/declarations
  const masterDocPath = path.join(__dirname, masterConfigPath);
  fs.writeFileSync(masterDocPath, JSON.stringify(updatedConfig, null, 2));
}

// no-dd-sa:javascript-inclusive/declarations
function masterConfigUpdate() {
  try {
    const timestamp = getCurrentTimestamp();
    // no-dd-sa:javascript-inclusive/declarations
    const masterConfig = fetchMasterConfig();
    const docUrl = parseDocConfigUrl('--docUrl=');

    if (!docUrl) {
      console.log('ERROR: No document URL found to process');
      process.exit(1);
    }

    const { updatedConfig, wasUpdated } = updateConfig(masterConfig, docUrl, timestamp);
    if (wasUpdated) {
      saveToMasterDoc(updatedConfig);
    }

    process.exit(0);
    
  } catch (error) {
    console.error(`Script failed: ${error.message}`);
    process.exit(1);
  }
}

masterConfigUpdate();

module.exports = masterConfigUpdate;