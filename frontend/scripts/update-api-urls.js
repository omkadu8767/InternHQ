#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the components directory
const componentsDir = path.join(__dirname, '..', 'src', 'components');
const storeDir = path.join(__dirname, '..', 'src', 'store');

// API endpoints mapping
const apiMappings = {
    'http://localhost:5000/api/auth/getuser': 'ApiService.getApiUrl("/auth/getuser")',
    'http://localhost:5000/api/auth/login': 'ApiService.getApiUrl("/auth/login")',
    'http://localhost:5000/api/auth/register': 'ApiService.getApiUrl("/auth/register")',
    'http://localhost:5000/api/tasks': 'ApiService.getApiUrl("/tasks")',
    'http://localhost:5000/api/tasks/assigned': 'ApiService.getApiUrl("/tasks/assigned")',
    'http://localhost:5000/api/tasks/performance': 'ApiService.getApiUrl("/tasks/performance")',
    'http://localhost:5000/api/tasks/leaderboard': 'ApiService.getApiUrl("/tasks/leaderboard")',
    'http://localhost:5000/api/tasks/admin/interns': 'ApiService.getApiUrl("/tasks/admin/interns")',
    '`http://localhost:5000/api/tasks/submit/${': '`${ApiService.getApiUrl("/tasks/submit/")}${',
    '`http://localhost:5000/api/tasks/evaluate/${': '`${ApiService.getApiUrl("/tasks/evaluate/")}${',
    '"http://localhost:5000/api/': 'ApiService.getApiUrl("/',
};

function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Add import statement if not present and localhost URLs found
        if (content.includes('localhost:5000') && !content.includes('ApiService')) {
            const importRegex = /import\s+[\w\s,{}]+\s+from\s+["'][@\w\/.-]+["'];?\s*$/gm;
            const lastImport = [...content.matchAll(importRegex)].pop();

            if (lastImport) {
                const insertPos = lastImport.index + lastImport[0].length;
                content = content.slice(0, insertPos) + '\nimport ApiService from "@/services/api";' + content.slice(insertPos);
                updated = true;
            }
        }

        // Replace API URLs
        for (const [oldUrl, newUrl] of Object.entries(apiMappings)) {
            if (content.includes(oldUrl)) {
                content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
                updated = true;
            }
        }

        if (updated) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
    }
}

function processDirectory(dir) {
    try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                processDirectory(filePath);
            } else if (file.endsWith('.vue') || file.endsWith('.js')) {
                updateFile(filePath);
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error.message);
    }
}

// Process components and store directories
console.log('Starting API URL updates...');
processDirectory(componentsDir);
processDirectory(storeDir);
console.log('API URL updates completed!');