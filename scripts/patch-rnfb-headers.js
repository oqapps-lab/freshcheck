#!/usr/bin/env node
// Verbatim from sugar-quit (last shipped 2026-05-09 17:00, build a223cc41).
//
// Runs from package.json `postinstall` to physically rewrite
// @react-native-firebase headers to use @import (modular) instead of
// #import <React/...> (non-modular). This is what unblocks the
// "include of non-modular header inside framework module" Xcode error
// under useFrameworks: static + Expo SDK 55 prebuilt RNCore.
//
// Why a postinstall script in addition to the config plugin: EAS Build
// runs `npm install` (or `npm ci`) BEFORE running config plugins, and
// the plugin doesn't always re-run reliably on EAS Cloud. Postinstall
// hook is guaranteed to fire on every install — so the headers are
// patched before Xcode ever touches them.

const fs = require('fs');
const path = require('path');

const rnfbDir = path.join(__dirname, '..', 'node_modules', '@react-native-firebase');
if (!fs.existsSync(rnfbDir)) {
  console.log('[patch-rnfb-headers] node_modules/@react-native-firebase not found, skipping');
  process.exit(0);
}

let patched = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue;
      walk(p);
    } else if (e.name.endsWith('.h') || e.name.endsWith('.m')) {
      let src = fs.readFileSync(p, 'utf8');
      const before = src;
      src = src.replace(/^#import\s+<React\/[^>]+\.h>\s*$/gm, '@import React;');
      src = src.replace(/^#import\s+<RCTRequired\/[^>]+\.h>\s*$/gm, '@import RCTRequired;');
      src = src.replace(/^#import\s+<RCTTypeSafety\/[^>]+\.h>\s*$/gm, '@import RCTTypeSafety;');
      if (src !== before) {
        fs.writeFileSync(p, src);
        patched++;
      }
    }
  }
}
walk(rnfbDir);
console.log(`[patch-rnfb-headers] patched ${patched} files`);
