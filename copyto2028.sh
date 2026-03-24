#!/usr/bin/env bash
set -euo pipefail

# Copy 2019-es7 game files from easierbycode.github.io to the 2028 repo
# Usage: Run from the easierbycode.github.io repo root
#   ./scripts/copy-to-2028.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_REPO="$(dirname "$SCRIPT_DIR")"
TARGET_REPO="$SOURCE_REPO/../2028"

echo "=== Copy 2019-es7 → 2028 ==="
echo "Source: $SOURCE_REPO"
echo "Target: $TARGET_REPO"
echo ""

# Clone if target doesn't exist
if [ ! -d "$TARGET_REPO" ]; then
  echo "📦 Target repo not found — cloning from GitHub..."
  git clone https://github.com/easierbycode/2028.git "$TARGET_REPO"
  echo ""
fi

# Game content lives in games/2019/
GAME_SRC="$SOURCE_REPO/games/2019"

if [ ! -d "$GAME_SRC" ]; then
  echo "❌ Error: games/2019/ not found in source repo"
  exit 1
fi

echo "📁 Copying game files..."

# Copy the main game directory (index.html, assets/, src/, v1/)
echo "  games/2019/ → 2028/games/2019/"
mkdir -p "$TARGET_REPO/games/2019"
cp -R "$GAME_SRC"/* "$TARGET_REPO/games/2019/"

# Copy any 2019-es7 related files from root level if they exist
# (level atlas, icons, etc. that might be referenced)
for pattern in "*2019*" "*es7*"; do
  for f in "$SOURCE_REPO"/$pattern; do
    [ -e "$f" ] || continue
    fname="$(basename "$f")"
    echo "  $fname → 2028/$fname"
    cp -R "$f" "$TARGET_REPO/$fname"
  done
done

# Check for level atlas files referenced by the game
if [ -d "$SOURCE_REPO/games/2019/v1" ]; then
  echo "  games/2019/v1/ (PWA version) included"
fi

echo ""
echo "✅ Done! Files copied to $TARGET_REPO"
echo ""
echo "Next steps:"
echo "  cd $TARGET_REPO"
echo "  git status    # review what was added"
echo "  git add -A && git commit -m 'Import 2019-es7 game files'"
