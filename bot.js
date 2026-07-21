const bedrock = require('bedrock-protocol');

const HOST = process.env.HOST || 'Aryanahfsg.aternos.me';
const PORT = parseInt(process.env.PORT || '55027');
const BOT_NAME = process.env.BOT_NAME || 'KeepAliveBot';

let client = null;
let timer = null;
let attempt = 0;

function connect() {
  console.log(`[+] Connecting ${BOT_NAME} to ${HOST}:${PORT}...`);
  
  client = bedrock.createClient({
    host: HOST,
    port: PORT,
    username: BOT_NAME,
    offline: true
  });

  client.on('session', () => { console.log('[✓] Connected!'); attempt = 0; });
  client.on('join', () => { console.log('[✓] Joined server!'); startPing(); });
  client.on('spawn', () => { console.log('[✓] Spawned!'); });
  client.on('error', e => console.error('[!]', e.message));
  client.on('close', () => { client = null; stopPing(); reconnect(); });
}

function startPing() {
  stopPing();
  timer = setInterval(() => {
    if (!client || !client.session) return;
    try {
      client.queue('tick_sync', { request_time: BigInt(Date.now()), response_time: 0n });
    } catch(e) {}
  }, 20000);
}

function stopPing() { if (timer) { clearInterval(timer); timer = null; } }

function reconnect() {
  const delay = Math.min(5000 * Math.pow(1.5, attempt), 60000);
  attempt++;
  console.log(`[~] Reconnect in ${Math.round(delay/1000)}s (attempt ${attempt})`);
  setTimeout(connect, delay);
}

process.on('SIGINT', () => { stopPing(); if(client) try{client.disconnect()}catch(e){} process.exit(0); });
process.on('SIGTERM', () => { stopPing(); if(client) try{client.disconnect()}catch(e){} process.exit(0); });

console.log('=== Aternos Bedrock 24/7 Bot ===');
connect();
