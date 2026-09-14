#!/usr/bin/env node

/**
 * Eqvitta Accounting MCP Server Bridge
 * Connects Claude Desktop / MCP Clients to Eqvitta's Remote MCP Engine.
 */

const readline = require('readline');

const ENDPOINT = process.env.EQVITTA_MCP_ENDPOINT || 'https://chatapi.eqvitta.com/webhook/mcp';

// Parse API key from CLI arguments or environment variables
let apiKey = process.env.EQVITTA_API_KEY || '';
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--api-key' && args[i + 1]) {
    apiKey = args[i + 1];
    i++;
  } else if (args[i].startsWith('--api-key=')) {
    apiKey = args[i].split('=')[1];
  } else if (args[i] === '--header' && args[i + 1]) {
    const parts = args[i + 1].split(':');
    if (parts[0].trim().toLowerCase() === 'x-api-key') {
      apiKey = parts.slice(1).join(':').trim();
    }
    i++;
  }
}

if (!apiKey) {
  console.error('[eqvitta-mcp] Warning: No EQVITTA_API_KEY provided. Tool access may be limited.');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let request;
  try {
    request = JSON.parse(trimmed);
  } catch (err) {
    console.error('[eqvitta-mcp] Invalid JSON received on stdin:', trimmed);
    return;
  }

  // Handle client notifications that don't expect a response
  if (request.method === 'notifications/initialized') {
    return;
  }

  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[eqvitta-mcp] HTTP Error ' + res.status + ':', errText);
      const errPayload = {
        jsonrpc: '2.0',
        id: request.id ?? null,
        error: {
          code: -32603,
          message: 'HTTP ' + res.status + ': ' + errText
        }
      };
      process.stdout.write(JSON.stringify(errPayload) + '\n');
      return;
    }

    const data = await res.json();
    process.stdout.write(JSON.stringify(data) + '\n');
  } catch (e) {
    console.error('[eqvitta-mcp] Request error:', e.message || String(e));
    const errPayload = {
      jsonrpc: '2.0',
      id: request.id ?? null,
      error: {
        code: -32603,
        message: 'Network error communicating with Eqvitta MCP server: ' + (e.message || String(e))
      }
    };
    process.stdout.write(JSON.stringify(errPayload) + '\n');
  }
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
