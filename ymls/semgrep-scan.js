const { execSync } = require("child_process");
const axios = require("axios");

// Environment Variables from Azure Pipelines
const pullRequestId = process.env.PR_ID; // Pull Request ID
const repoName = process.env.REPO_NAME; // Repository Name
const organization = process.env.ORG; // Azure DevOps Organization
const project = process.env.PROJECT; // Azure DevOps Project
const token = process.env.AZURE_DEVOPS_TOKEN; // Personal Access Token

const apiBaseUrl = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repoName}`;

async function getChangedFiles() {
    try {
        const response = await axios.get(`${apiBaseUrl}/pullRequests/${pullRequestId}/files`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.value.map(file => file.path);
    } catch (error) {
        console.error("Error fetching changed files:", error.message);
        process.exit(1);
    }
}

async function postComment(comment) {
    try {
        await axios.post(
            `${apiBaseUrl}/pullRequests/${pullRequestId}/threads`,
            {
                comments: [{ content: comment, commentType: "text" }],
                status: "active"
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error("Error posting comment:", error.message);
    }
}

async function runSemgrep(files) {
    for (const file of files) {
        try {
            const output = execSync(`semgrep --json --include ${file}`).toString();
            const results = JSON.parse(output).results;

            if (results.length > 0) {
                let comment = `**Semgrep Findings for ${file}:**\n`;
                results.forEach(result => {
                    comment += `- [${result.check_id}](${result.extra.url}): ${result.extra.message} (Line ${result.start.line})\n`;
                });
                await postComment(comment);
            }
        } catch (error) {
            console.error(`Error scanning ${file}:`, error.message);
        }
    }
}

(async () => {
    const changedFiles = await getChangedFiles();
    if (changedFiles.length === 0) {
        console.log("No files changed in this PR.");
        return;
    }

    console.log("Running Semgrep on changed files...");
    await runSemgrep(changedFiles);
})();