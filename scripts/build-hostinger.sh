#!/usr/bin/env bash
# Build the static site for Hostinger.
#   scripts/build-hostinger.sh preview   -> https://preview.universalblooming.com (noindex)
#   scripts/build-hostinger.sh prod      -> https://universalblooming.com
# Output: ./out-hostinger (upload with scripts/deploy-ftp.py).
set -euo pipefail
cd "$(dirname "$0")/.."
TARGET="${1:-preview}"
case "$TARGET" in
  preview) URL="https://preview.universalblooming.com"; NOINDEX=1 ;;
  prod)    URL="https://universalblooming.com";         NOINDEX=0 ;;
  *) echo "usage: $0 preview|prod"; exit 1 ;;
esac

# Swap server-only pieces for static ones, and always restore them afterwards.
node scripts/prepare-static-export.mjs >/dev/null
trap 'git checkout -- src/app/actions/lead.ts src/app/og 2>/dev/null; rm -f public/.nojekyll' EXIT

rm -rf out out-hostinger
NEXT_PUBLIC_STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH="" NEXT_PUBLIC_SITE_URL="$URL" \
NEXT_PUBLIC_NOINDEX="$NOINDEX" NEXT_PUBLIC_LEAD_ENDPOINT="/lead.php" \
  npx next build

mv out out-hostinger
rm -f out-hostinger/.nojekyll
cp deploy/hostinger/lead.php out-hostinger/lead.php
if [ "$NOINDEX" = "1" ]; then
  sed 's/#NOINDEX# //' deploy/hostinger/.htaccess > out-hostinger/.htaccess
else
  grep -v '#NOINDEX#' deploy/hostinger/.htaccess > out-hostinger/.htaccess
fi
echo "built $TARGET for $URL -> out-hostinger ($(find out-hostinger -type f | wc -l) files)"
