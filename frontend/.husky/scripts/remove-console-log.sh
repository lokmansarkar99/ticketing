#!/bin/sh

# Find all staged .js, .ts, .tsx files and remove console.log statements
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|ts|tsx)$')

for file in $STAGED_FILES; do
  if [ -f "$file" ]; then
    # Remove console.log lines
    sed -i '' '/console\.log/d' "$file" 2>/dev/null || sed -i '/console\.log/d' "$file"
    git add "$file"
  fi
done