#!/usr/bin/env node
/**
 * SO Survey importer
 *
 * Usage:
 *   node scripts/import-so-survey.js <path-to-survey.csv>
 *
 * Downloads the SO Developer Survey CSV from:
 *   https://survey.stackoverflow.co/
 *
 * Updates backend/storage/app/metrics.json with new so_loved and so_used values.
 */

const fs   = require('fs');
const path = require('path');

const csvPath     = process.argv[2];
const metricsPath = path.join(__dirname, '../backend/storage/app/metrics.json');

if (!csvPath) {
    console.error('Usage: node import-so-survey.js <path-to-survey.csv>');
    process.exit(1);
}

if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
}

const csv     = fs.readFileSync(csvPath, 'utf8');
const lines   = csv.split('\n');
const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

const haveWorkedIdx  = headers.indexOf('LanguageHaveWorkedWith');
const wantToWorkIdx  = headers.indexOf('LanguageWantToWorkWith');

if (haveWorkedIdx === -1 || wantToWorkIdx === -1) {
    console.error('Could not find LanguageHaveWorkedWith or LanguageWantToWorkWith columns.');
    console.error('Available columns:', headers.slice(0, 20).join(', '));
    process.exit(1);
}

const usedCount   = {};
const lovedCount  = {};
const totalRows   = { used: 0, loved: 0 };

for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
    if (cols.length < headers.length) continue;

    const haveWorked = cols[haveWorkedIdx]?.split(';').map(s => s.trim()).filter(Boolean) || [];
    const wantToWork = cols[wantToWorkIdx]?.split(';').map(s => s.trim()).filter(Boolean) || [];

    if (haveWorked.length > 0) {
        totalRows.used++;
        haveWorked.forEach(lang => { usedCount[lang] = (usedCount[lang] || 0) + 1; });
    }

    // "Loved" = used AND want to work with next year
    if (haveWorked.length > 0 && wantToWork.length > 0) {
        totalRows.loved++;
        haveWorked.forEach(lang => {
            if (wantToWork.includes(lang)) {
                lovedCount[lang] = (lovedCount[lang] || 0) + 1;
            }
        });
    }
}

const so_used  = {};
const so_loved = {};

Object.entries(usedCount).forEach(([lang, count]) => {
    so_used[lang] = Math.round((count / totalRows.used) * 100);
});

Object.entries(lovedCount).forEach(([lang, count]) => {
    so_loved[lang] = Math.round((count / totalRows.loved) * 100);
});

// Update metrics.json
const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
metrics.so_used  = so_used;
metrics.so_loved = so_loved;
metrics._meta.so_survey_year = new Date().getFullYear();

fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));

console.log(`✓ Updated so_used (${Object.keys(so_used).length} langs) and so_loved (${Object.keys(so_loved).length} langs)`);
console.log(`  Based on ${totalRows.used} responses`);