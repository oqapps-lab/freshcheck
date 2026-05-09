const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Verbatim from sugar-quit / Vitaminico (battle-tested 2026-05-08).
// Without this, @react-native-firebase pods fail to compile in static frameworks
// mode with "non-modular header inside framework module" errors. Setting
// CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES=YES on every pod target
// silences the strict check that blocks RNFB pods from including React-Core
// non-modular headers like <React/RCTConvert.h>.

const MARKER = '# RNFB-non-modular-headers-fix-marker';

const INJECTION = `    # ${MARKER.replace('# ', '')}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end`;

module.exports = function withModularHeadersFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      if (!fs.existsSync(podfilePath)) return cfg;
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      if (podfile.includes(MARKER.replace('# ', ''))) return cfg;
      const re = /(post_install\s+do\s+\|installer\|\s*\n)/m;
      if (re.test(podfile)) {
        podfile = podfile.replace(re, `$1${INJECTION}\n\n`);
      } else {
        podfile += `\npost_install do |installer|\n${INJECTION}\nend\n`;
      }
      fs.writeFileSync(podfilePath, podfile);
      return cfg;
    },
  ]);
};
