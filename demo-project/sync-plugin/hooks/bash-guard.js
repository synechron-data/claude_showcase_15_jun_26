#!/usr/bin/env node
/**
 * PreToolUse hook: blocks dangerous Bash commands before Claude runs them.
 * Exit 0 = allow, exit 2 = block (Claude sees the printed reason).
 */

const fs   = require('fs');
const path = require('path');

const LOG_FILE = path.join('.claude', 'bash-guard.log');

function appendLog(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n', 'utf8');
}

const DANGER_PATTERNS = [
    /rm\s+-rf\s+\//,
    /sudo\s+rm/,
    /:\(\)\{:|:&\};:/,          // fork bomb
    /dd\s+if=.*of=\/dev\/sd/,
    /chmod\s+777\s+\//,
];

let raw = '';
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
    let cmd;
    try {
        cmd = JSON.parse(raw).tool_input?.command ?? '';
    } catch {
        process.exit(0);
    }

    const timestamp = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' });

    for (const pattern of DANGER_PATTERNS) {
        if (pattern.test(cmd)) {
            const reason = `BLOCKED — matches danger pattern: ${pattern}`;
            appendLog(`[${timestamp}] ${reason}`);
            appendLog(`  cmd=${cmd}`);
            appendLog('');
            console.error(reason);
            process.exit(2);
        }
    }

    appendLog(`[${timestamp}] ALLOWED cmd=${cmd}`);
    process.exit(0);
});
