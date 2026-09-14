# Eqvitta Accounting MCP Server

[![MCP Standard](https://img.shields.io/badge/MCP-Standard%202024--11--05-blue)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/Node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

Official [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for **Eqvitta Cloud Accounting & GST Billing**.

Connect Claude Desktop, Claude Code, and any MCP-compliant AI client directly to your Eqvitta accounting records. Seamlessly generate GST sales & purchase invoices, manage ledgers, post receipts & payments, query trial balances, and reconcile financial statements with strict role-based data isolation.

---

## ⚡ Quick Start with Claude Desktop

### Automatic 1-Click Install (Smithery)
If using [Smithery](https://smithery.ai):
```bash
npx -y @smithery/cli install eqvitta-mcp --client claude
```

---

### Manual Configuration

Add the server to your `claude_desktop_config.json`:

- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "eqvitta": {
      "command": "npx",
      "args": ["-y", "github:Eqvitta/eqvitta-mcp"],
      "env": {
        "EQVITTA_API_KEY": "YOUR_EQVITTA_API_KEY_HERE"
      }
    }
  }
}
```

> **How to get your API Key**: Log in to Eqvitta > **Settings** > **API Keys** > Generate a new Key.

---

## 🚀 Key Features

- **GST Invoicing**:
  - Automatically calculates CGST, SGST, IGST, and rounding off.
  - Automatically assigns the next sequential invoice number (e.g. `NR/2627/005`).
  - Creates balanced double-entry ledger postings instantly.
- **Ledgers & Account Groups**:
  - Look up ledgers, outstanding balances, party contact details, and account group structures.
- **Vouchers & Transactions**:
  - Record Bank / Cash receipts and payments against customers, suppliers, and expense ledgers.
  - Record outward and inward service invoices.
- **Real-Time Financial Reports**:
  - Instant Trial Balance, Profit & Loss summaries, and Ledger Account Statements.
- **Role-Based Security**:
  - Multi-tenant tenant isolation. All actions are scoped to companies the API key user is assigned to.
  - Destructive operations (edits and deletions) are strictly disabled over MCP.
  - Internal ledger transfers and financial adjustments require elevated administrative privileges (`financialreporteditor` or `company_admin`).

---

## 🛠️ Available MCP Tools

| Category | Tools | Description |
| :--- | :--- | :--- |
| **Companies & Ledgers** | `list_companies`, `search_ledgers`, `get_ledger_balance`, `get_ledger_statement`, `update_ledger_contact` | Explore companies, query balances, and view statement entries. |
| **Inventory & Catalogs** | `search_stocks`, `get_stock_detail`, `search_account_groups` | Search stock items, quantities, HSN/SAC codes, and accounting groups. |
| **Invoicing** | `create_sales_invoice`, `create_purchase_invoice`, `create_service_outward`, `create_service_inward`, `create_logistic_invoice` | Generate GST-compliant sales, purchase, service, and freight vouchers. |
| **Receipts & Payments** | `create_receipt_voucher`, `create_payment_voucher` | Record customer payments and supplier payouts against bank/cash accounts. |
| **Financial Reports** | `get_trial_balance`, `get_financial_statement` | Retrieve structured balance sheet and profit & loss figures. |
| **Challans** | `search_challans`, `get_challan_detail` | Track delivery and transport challans. |
| **Admin Transfers** *(Gated)* | `transfer_ledger_journal`, `transfer_group_balances_journal`, `bulk_transfer_transactions_ledger` | Shift ledger entries and transfer balances (only visible to authorized roles). |

---

## 🔒 Security & Architecture

The `eqvitta-mcp` CLI connects to Eqvitta's high-availability remote engine (`https://chatapi.eqvitta.com/webhook/mcp`). 
- **Zero Local Maintenance**: All schema changes and accounting rule updates are managed on the cloud engine. Your client never requires manual version updates.
- **Encrypted Communication**: All traffic is encrypted over TLS 1.3.
- **Least Privilege**: Only tools authorized by the user's role are exposed to the AI model.

---

## 📄 License

MIT License. Copyright (c) 2026 Eqvitta Software Solutions.
