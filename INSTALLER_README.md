# CAT CLI Installation Guide 🐱

This guide covers how to install the Coding Agentic Terminal (CAT) on your system.

## 🪟 Windows (PowerShell)

Run the following command in your terminal:

```powershell
irm https://raw.githubusercontent.com/YOUR_USERNAME/cat-cli/main/install.ps1 | iex
```

### What this does:
1. Checks for Node.js 22+.
2. Installs `cat-cli` globally via npm.
3. Sets up your environment.

## 🍎 macOS / 🐧 Linux (Bash/Zsh)

Run the following command:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/cat-cli/main/install.sh | bash
```

### What this does:
1. Detects your OS and shell.
2. Checks for Node.js using `node -v`.
3. Installs `cat-cli` globally.

## 🛠️ Manual Installation

If you prefer to install manually:

1. Clone the repository: `git clone https://github.com/YOUR_USERNAME/cat-cli.git`
2. Enter the directory: `cd cat-cli`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Link the binary: `npm link`

## ❓ Troubleshooting

- **Node.js missing:** Ensure you have Node.js 22 or higher installed.
- **npm error:** Try running the terminal as Administrator (Windows) or using `sudo` (Unix).
- **API Key not working:** Verify your key in the [NVIDIA API Catalog](https://integrate.api.nvidia.com).
