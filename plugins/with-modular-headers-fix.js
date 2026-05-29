/**
 * sugar-quit recipe extended for v1.1.4 (Phase 4 — AppsFlyer restore).
 *
 * Two-layer fix for vendor SDKs that include React-Core headers in
 * non-modular form (#import <React/X.h>) which breaks under
 * useFrameworks: static + Expo SDK 55 prebuilt RNCore:
 *
 *  1. Physically rewrite vendor SDK .h/.m files to use `@import React;`
 *     (modular). Done both as a config-plugin step (here) and as a
 *     package.json `postinstall` hook (scripts/patch-rnfb-headers.js).
 *  2. Inject `$RNFirebaseAsStaticFramework = true` at top of Podfile +
 *     CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES on
 *     every Pod target inside the existing post_install block.
 *
 * Currently covers @react-native-firebase + react-native-appsflyer.
 * Add new vendor dirs to TARGET_DIRS below if a future SDK install
 * fails with the same modular-header error.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  '@react-native-firebase',
  'react-native-appsflyer',
];

function patchHeaders(projectRoot) {
  // Mirror the postinstall script's simulator skip — see
  // scripts/patch-rnfb-headers.js for the modulemap rationale. Without
  // bailing here the prebuild step still rewrites headers to @import,
  // breaking sim slice compilation even after npm install was sim-safe.
  const PROFILE = process.env.EAS_BUILD_PROFILE || '';
  if (/simulator/i.test(PROFILE)) {
    console.log(`[with-modular-headers-fix] header patch skipped — EAS_BUILD_PROFILE=${PROFILE}`);
    return 0;
  }
  let total = 0;
  for (const target of TARGET_DIRS) {
    const dir = path.join(projectRoot, 'node_modules', target);
    if (!fs.existsSync(dir)) continue;
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
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
            total++;
          }
        }
      }
    };
    walk(dir);
  }
  return total;
}

const MARKER = '# RNFB-static-framework-fix-v3-marker';

const POST_INSTALL_INJECTION = `    # ${MARKER.replace('# ', '')}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end`;

const HEADER_GLOBALS = `# ${MARKER.replace('# ', '')}
$RNFirebaseAsStaticFramework = true

`;

module.exports = function withModularHeadersFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const n = patchHeaders(projectRoot);
      console.log(`[with-modular-headers-fix] patched ${n} headers across ${TARGET_DIRS.length} target dir(s)`);

      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) return cfg;
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      if (podfile.includes(MARKER.replace('# ', ''))) return cfg;

      podfile = HEADER_GLOBALS + podfile;

      const re = /(post_install\s+do\s+\|installer\|\s*\n)/m;
      if (re.test(podfile)) {
        podfile = podfile.replace(re, `$1${POST_INSTALL_INJECTION}\n\n`);
      } else {
        podfile += `\npost_install do |installer|\n${POST_INSTALL_INJECTION}\nend\n`;
      }

      fs.writeFileSync(podfilePath, podfile);
      return cfg;
    },
  ]);
};
