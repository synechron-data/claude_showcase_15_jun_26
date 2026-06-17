const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join('.claude', 'pretooluse-demo.log');

function log(text) {
    fs.appendFileSync(LOG_FILE, text + '\n', 'utf8');
}

let raw = '';
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
    const payload = JSON.parse(raw);
    const timestamp = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' });

    log('\n' + '='.repeat(60));
    log(`[${timestamp}] tool=${payload.tool_name}`);
    log('STDIN PAYLOAD:');
    log(JSON.stringify(payload, null, 2));

    process.exit(0);

    // console.error('[pretooluse-demo] Blocked: demo block is active')
    // process.exit(2);

    // const response = {
    //     hookSpecificOutput: {
    //         hookEventName: 'PreToolUse',
    //         permissionDecision: 'allow',
    //         additionalContext: '[pretooluse-demo] hook allowed this tool call.',
    //         updatedInput: { ...payload.tool_input, command: 'echo overridden' },
    //     },
    // };
    // console.log(JSON.stringify(response));
    // process.exit(0);
});