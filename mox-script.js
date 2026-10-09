const fs = require('fs');
const path = require('path');
const https = require('https');
// Start configuration
const angularJsonPath = path.join(__dirname, 'angular.json');
let projectRoot = null;
try {
    if (!fs.existsSync(angularJsonPath)) {
        console.warn('angular.json not found in the current directory. Using default project root: "projects/host-app"');
        projectRoot = 'projects/host-app';
    } else {
        // no-dd-sa:javascript-node-security/detect-non-literal-fs-filename
        const angularJsonContent = fs.readFileSync(angularJsonPath, 'utf8');
        const angularJson = JSON.parse(angularJsonContent);
        const projects = angularJson.projects;
        if (!projects) {
            throw new Error('Projects object not found in angular.json');
        }
        const projectNames = Object.keys(projects);
        if (projectNames.length === 0) {
            throw new Error('No projects found in angular.json');
        }
        const firstProjectName = projectNames[0];
        projectRoot = projects[firstProjectName].root;
        if (!projectRoot) {
            console.warn('Could not determine project root. Using default: "projects/host-app"');
            projectRoot = 'projects/host-app';
        }
    }
} catch (error) {
    console.error('An error occurred while reading angular.json:', error.message);
    projectRoot = 'projects/host-app';
    console.warn('Using default project root: "projects/host-app"');
}
// Mox-Script
const moduleDirectory = projectRoot;
const inputFilePath = path.join(__dirname, moduleDirectory, 'src', 'assets', 'i18n');
const outputFilePath = path.join(__dirname, moduleDirectory, 'src', 'assets', 'i18n');
const BASE_URL = "https://localization.moxwave.com";
const LANGUAGESCODE = ['hi'];
const LANGUAGES = ['hindi'];
const SOURCE_LANGUAGE = 'english';
const FILES = ['en.json'];
const args = process.argv;
const SECRETKEY = '3619-D80A-EDEB-45CD-4BDF-DD91-AAC4-8A54';

async function start() {
    for (var i in FILES) {
        let inputFile = path.join(inputFilePath, FILES[i]);
        console.info('Translation has started for ', FILES[i]);
        // Verify inputFile exists
        if (!fs.existsSync(inputFile)) {
            console.error(`Input file not found: ${inputFile}`);
            continue; // Skip to the next file
        }
        for (var index in LANGUAGESCODE) {
            const langName = LANGUAGES[index];
            console.info('Translation has started for ', langName);
            let lng = LANGUAGESCODE[index];
            let outputFile = path.join(outputFilePath, lng + '.json');
            try {
                let i18nContent = await readI18nFile(inputFile);
                let texts = [];
                let lngtexts = [];
                await GetText(i18nContent, texts);
                const chunkSize = 10;
                for (let i = 0; i < texts.length; i += chunkSize) {
                    const chunk = texts.slice(i, i + chunkSize);
                    let response = await translate(chunk, langName);
                    if (response && response.data) {
                        for (var index in response.data) {
                            let data = response.data[index];
                            lngtexts[data.orgtext] = data.text;
                        }
                    } else {
                        console.warn(`No translation data received for chunk ${i / chunkSize}`);
                    }
                }
                UpdateText(i18nContent, lngtexts);
                await writeI18nFile(outputFile, i18nContent);
                console.info('Translation is complete for ', langName);
            } catch (error) {
                console.error(`Error during translation for ${langName}:`, error.message);
            }
        }
        console.info('Translation is complete for:', FILES[i]);
    }
}
async function readI18nFile(filePath) {
    try {
        // no-dd-sa:javascript-node-security/detect-non-literal-fs-filename
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonContent = JSON.parse(data);
        return jsonContent;
    } catch (err) {
        console.error('Error reading or parsing i18n file:', err.message);
        process.exit(1);
    }
}
async function GetText(obj, texts) {
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            GetText(obj[key], texts);
        }
        else if (Array.isArray(obj[key])) {
            GetText(obj[key], texts);
        }
        else {
            let trasText = obj[key];
            if (typeof trasText === 'string' && trasText.trim().length > 0) {
                texts.push({
                    'text': obj[key],
                    'qual': '7',
                    'op': '0'
                });
            }
        }
    }
}
async function UpdateText(obj, texts) {
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            UpdateText(obj[key], texts);
        }
        else if (Array.isArray(obj[key])) {
            UpdateText(obj[key], texts);
        }
        else {
            let trasText = obj[key];
            if (typeof trasText === 'string' && texts[obj[key]]) {
                obj[key] = texts[obj[key]];
            }
        }
    }
}
async function translate(texts, lng) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            'key': SECRETKEY,
            'data': texts,
            'InputLanguage': SOURCE_LANGUAGE,
            'lang': [
                lng
            ]
        });
        const options = {
            hostname: 'bfl-prod-text.moxwave.com',
            port: 443,
            path: '/p9/Moxapi.ashx',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'lang': 'p9'
            }
        }
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    console.info("response data is", responseData);
                    const parsedResponse = JSON.parse(responseData);
                    resolve(parsedResponse);
                    console.log(responseData, "Response Data Log");
                } catch (ex) {
                    console.error("Error parsing API response:", responseData);
                    console.error("Error is ", ex);
                    reject(ex); // Reject the promise on parsing error
                }
            });
        });
        req.on('error', (error) => {
            reject(error);
            console.log(error.message, "Error Message for Translation");
        });
        req.write(postData);
        req.end();
    });
}
async function writeI18nFile(filePath, jsonObj) {
    const jsonContent = JSON.stringify(jsonObj, null, 2);
    fs.writeFile(filePath, jsonContent, (err) => {
        if (err) {
            console.error('Error in write  file:', err.message);
            process.exit(1);
        }
    });
}

start();
