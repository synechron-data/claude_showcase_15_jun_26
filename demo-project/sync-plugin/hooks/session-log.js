#!/usr/bin/env node
/**
 * Stop hook: appends a per-turn token/cost summary to .claude/session-log.log.
 * Usage data is parsed from the transcript JSONL provided via stdin.
 */

const fs = require('fs');
const path = require('path');

const logFile = path.join('.claude', 'session-log.log');
const timestamp = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' });

/** Sequential turn number derived from entries already written to the log. */
function getNextTurnNumber() {
    try {
        const content = fs.readFileSync(logFile, 'utf8');
        const matches = content.match(/^\[Turn #\d+\]/gm);
        return matches ? matches.length + 1 : 1;
    } catch {
        return 1;
    }
}

/** Format a token count with thousands separators (en-US). */
function fmt(n) {
    return n.toLocaleString('en-US');
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    let transcriptPath = null;

    try {
        const payload = JSON.parse(input);
        transcriptPath = payload.transcript_path;
    } catch {
        // running outside Claude Code (e.g. manual test) — no stdin payload
    }

    let cost = 0;
    let newTokens = 0;
    let cacheRead = 0;
    let cacheWrite = 0;
    let output = 0;
    let parsed = false;

    if (transcriptPath && fs.existsSync(transcriptPath)) {
        const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(l => l.trim());
        for (const line of lines) {
            try {
                const entry = JSON.parse(line);
                if (entry.costUSD != null) cost = entry.costUSD;
                const u = entry.usage || entry.message?.usage;
                if (u) {
                    newTokens = u.input_tokens || 0;
                    output = u.output_tokens || 0;
                    cacheRead = u.cache_read_input_tokens || 0;
                    cacheWrite = u.cache_creation_input_tokens || 0;
                    parsed = true;
                }
            } catch { /* skip malformed lines */ }
        }
    }

    const turnNumber = getNextTurnNumber();
    const fmtCost = c => c > 0 ? `$${c.toFixed(4)}` : 'included in plan';

    const promptTotal = newTokens + cacheRead;
    const cacheDetail = cacheRead > 0
        ? `(from cache: ${fmt(cacheRead)} | new: ${fmt(newTokens)})`
        : `(all new)`;

    const lines = parsed
        ? [
            `  Prompt tokens  : ${fmt(promptTotal).padStart(8)}  ${cacheDetail}`,
            `  Response tokens: ${fmt(output).padStart(8)}`,
            `  Cost           : ${fmtCost(cost)}`,
        ]
        : ['  Token data not available — transcript not found or empty'];

    const header = `[Turn #${turnNumber}] ${timestamp}`;
    const entry = `${header}\n${lines.join('\n')}\n`;

    console.log(`\n[session-log] Turn #${turnNumber} | cost: ${fmtCost(cost)} | ${timestamp}\n`);

    try {
        fs.appendFileSync(logFile, entry + '\n', 'utf8');
    } catch (err) {
        console.error(`[session-log] Could not write log: ${err.message}`);
    }
});
