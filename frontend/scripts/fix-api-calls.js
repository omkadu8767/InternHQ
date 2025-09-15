#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the directories to check
const directories = [
    path.join(__dirname, '..', 'src', 'components'),
    path.join(__dirname, '..', 'src', 'store'),
    path.join(__dirname, '..', 'src', 'views')
];

// Patterns to fix
const fixes = [
    // Fix quoted ApiService calls
    {
        pattern: /"ApiService\.getApiUrl\("([^"]+)"\)"/g,
        replacement: 'ApiService.getApiUrl("$1")'
    },
    // Fix malformed URL concatenations
    {
        pattern: /ApiService\.getApiUrl\("\/tasks"\)\/([a-zA-Z\/]+)/g,
        replacement: 'ApiService.getApiUrl("/tasks/$1")'
    },
    // Fix missing closing parenthesis
    {
        pattern: /ApiService\.getApiUrl\("([^"]+)",/g,
        replacement: 'ApiService.getApiUrl("$1"),'
    }
];

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let fixed = false;

        // Apply all fixes
        fixes.forEach(fix => {
            if (fix.pattern.test(content)) {
                content = content.replace(fix.pattern, fix.replacement);
                fixed = true;
            }
        });

        // Check for import statement
        if (content.includes('ApiService') && !content.includes('import ApiService')) {
            const importRegex = /import\s+[\w\s,{}]+\s+from\s+["'][@\w\/.-]+["'];?\s*$/gm;
            const lastImport = [...content.matchAll(importRegex)].pop();

            if (lastImport) {
                const insertPos = lastImport.index + lastImport[0].length;
                content = content.slice(0, insertPos) + '\nimport ApiService from "@/services/api";' + content.slice(insertPos);
                fixed = true;
            }
        }

        if (fixed && content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
        }

        // Check for remaining issues
        const issues = [];
        if (content.includes('"ApiService.getApiUrl(')) {
            issues.push('Quoted ApiService calls found');
        }
        if (content.includes('localhost:5000')) {
            issues.push('Hardcoded localhost URLs found');
        }

        if (issues.length > 0) {
            console.log(`⚠️  Issues in ${path.relative(process.cwd(), filePath)}: ${issues.join(', ')}`);
        }

    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function processDirectory(dir) {
    try {
        if (!fs.existsSync(dir)) {
            console.log(`📁 Directory not found: ${dir}`);
            return;
        }

        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                processDirectory(filePath);
            } else if (file.endsWith('.vue') || file.endsWith('.js')) {
                fixFile(filePath);
            }
        }
    } catch (error) {
        console.error(`❌ Error processing directory ${dir}:`, error.message);
    }
}

// Process all directories
console.log('🔧 Starting API call fixes...\n');
directories.forEach(dir => {
    console.log(`📁 Processing: ${path.relative(process.cwd(), dir)}`);
    processDirectory(dir);
});
console.log('\n✨ API call fixes completed!');