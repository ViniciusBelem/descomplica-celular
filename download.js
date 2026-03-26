const { spawnSync } = require('child_process');
const routes = require('./stitch_routes.json');
const routesJson = JSON.stringify(routes).replace(/"/g, '\\"');

const result = spawnSync('npx.cmd', [
  '-y', '@_davideast/stitch-mcp', 'site',
  '-p', '8350851107438834130',
  '-r', routesJson,
  '-o', './stitch_screens'
], {
  env: { ...process.env, STITCH_API_KEY: "AQ.Ab8RN6IYSYmehc1dZHElb-Xf0sDeq9iQn7EdM5V6Qh8t4HpTZA" },
  stdio: 'inherit',
  shell: true
});

if (result.error) console.error('Error:', result.error);
console.log('Status:', result.status);
