#!/bin/bash
# build-and-prepare-dist.sh
# Usage: bash build-and-prepare-dist.sh

# Exit on error
set -e

# 1. Ensure asset folders exist in public/assets
mkdir -p public/assets/creatives
mkdir -p public/assets/important
mkdir -p public/assets/uploads

# 2. Copy favicons and icons to public if not already there
cp -n favicon.svg public/ 2>/dev/null || true
cp -n icons.svg public/ 2>/dev/null || true

# 3. Build the project
npm run build

# 4. Copy favicons and icons to dist (if not already copied by Vite)
cp -n public/favicon.svg dist/ 2>/dev/null || true
cp -n public/icons.svg dist/ 2>/dev/null || true

# 5. Print result

echo "Build complete. Deploy everything inside the dist/ folder (including all assets subfolders) to your server."
