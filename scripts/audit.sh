#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "================================================="
echo "🛡️ Starting TN-MBNR Security & Dependency Audit 🛡️"
echo "================================================="

echo "\n1. Running npm audit (Checking for dependency vulnerabilities)..."
# We run npm audit. If we want to strictly fail on high/critical, we can use audit-level
npm audit --audit-level=high

echo "\n2. Running Static Application Security Testing (SAST)..."
echo "Looking for common security anti-patterns in src/..."

# Check for hardcoded secrets
if grep -rnEi "secret|password|api_key|token" src/ | grep -v "mock"; then
    echo "⚠️  WARNING: Potential hardcoded secrets found!"
else
    echo "✅ No obvious hardcoded secrets detected in source files."
fi

# Check for dangerous innerHTML usage (XSS risk in React)
if grep -rn "dangerouslySetInnerHTML" src/; then
    echo "⚠️  WARNING: dangerouslySetInnerHTML found. Verify XSS protection!"
else
    echo "✅ No dangerouslySetInnerHTML usages found."
fi

echo "\n3. Checking for sensitive files in Git..."
if git ls-files | grep -E "\.env|credentials|secret"; then
    echo "⚠️  WARNING: Potential sensitive files committed to repository!"
else
    echo "✅ No obvious sensitive environment files in repository."
fi

echo "\n================================================="
echo "✅ Security & Dependency Audit Completed Successfully"
echo "================================================="
