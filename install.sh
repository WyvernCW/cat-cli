#!/bin/bash
set -e

echo -e "\033[36m╔══════════════════════════════════════╗"
echo -e "║  /\_/\  CAT CLI Installer  v1.0.0   ║"
echo -e "║ ( o.o )  Coding Agentic Terminal    ║"
echo -e "║  > ^ <   Powered by Minimax M2.7    ║"
echo -e "║ /|   |\                             ║"
echo -e "╚══════════════════════════════════════╝\033[0m"

echo -e "\n\033[33mChecking dependencies...\033[0m"

if command -v node >/dev/null 2>&1; then
    echo -e "\033[32m[✓] Node.js $(node -v) Detected\033[0m"
else
    echo -e "\033[31m[✗] Node.js not found. Please install Node.js 22+.\033[0m"
    exit 1
fi

if command -v git >/dev/null 2>&1; then
    echo -e "\033[32m[✓] Git Detected\033[0m"
else
    echo -e "\033[31m[✗] Git not found. Git is required to clone CAT CLI.\033[0m"
    exit 1
fi

echo -e "\n\033[33mInstalling CAT CLI...\033[0m"

TEMP_DIR=$(mktemp -d)
echo -e "\033[90mCloning repository...\033[0m"
git clone https://github.com/WyverncW/cat-cli.git "$TEMP_DIR" --quiet

cd "$TEMP_DIR"
echo -e "\033[90mInstalling dependencies & building...\033[0m"
npm install --quiet --no-warnings --loglevel error
npm run build --quiet

echo -e "\033[90mPackaging & installing globally...\033[0m"
PACK_FILE=$(npm pack --quiet | tail -n 1)
npm install -g "$TEMP_DIR/$PACK_FILE" --quiet --no-warnings --loglevel error

cd - > /dev/null
rm -rf "$TEMP_DIR"

echo -e "\n\033[32m╔══════════════════════════════════════════════════════╗"
echo -e "║  ✓  CAT CLI installed successfully!                  ║"
echo -e "║                                                      ║"
echo -e "║  Get started:                                        ║"
echo -e "║    cat-ai              → Start Cat                   ║"
echo -e "║    cat-ai config       → Set up your API key         ║"
echo -e "║                                                      ║"
echo -e "║     /\_/\  Happy coding!                             ║"
echo -e "║    ( ^.^ )                                           ║"
echo -e "║     > ^ <                                            ║"
echo -e "╚══════════════════════════════════════════════════════╝\033[0m"
