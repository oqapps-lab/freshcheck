#!/usr/bin/env node
// Patches non-modular header imports in iOS native modules so they can compile
// under useFrameworks: static + Expo SDK 55 prebuilt RNCore. Was originally
// for @react-native-firebase only (per sugar-quit recipe), extended for
// react-native-appsflyer in v1.1.4 (Phase 4 of vendor restore).
//
// Walks each TARGET_DIR and rewrites .h/.m files:
//   #import <React/X.h>       → @import React;
//   #import <RCTRequired/X.h> → @import RCTRequired;
//   #import <RCTTypeSafety/X.h> → @import RCTTypeSafety;
//
// Runs from package.json `postinstall` so it fires on every npm install,
// including EAS Build's `npm install` step before prebuild.

const fs = require('fs');
const path = require('path');

// node_modules subdirs whose .h/.m files need their React-Core imports
// rewritten to modular form. Add new entries when a freshly-installed
// vendor SDK breaks the build with the same non-modular error class.
const TARGET_DIRS = [
  '@react-native-firebase',
  'react-native-appsflyer',
];

let totalPatched = 0;

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
        totalPatched++;
      }
    }
  }
}

for (const target of TARGET_DIRS) {
  const dir = path.join(__dirname, '..', 'node_modules', target);
  if (!fs.existsSync(dir)) {
    console.log(`[patch-rnfb-headers] ${target} not installed, skipping`);
    continue;
  }
  walk(dir);
}

console.log(`[patch-rnfb-headers] patched ${totalPatched} files across ${TARGET_DIRS.length} target dir(s)`);
