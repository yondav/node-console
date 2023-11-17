import { execSync } from 'child_process';
import { resolve } from 'path';

const { 2: releaseVersion } = process.argv;
const currentVersion = process.env.npm_package_version as string;
const validVersion = /^([0-9]|[1-9][0-9]+).([0-9]|[1-9][0-9]+).([0-9]|[1-9][0-9]+)$/gu;
const colors = {
  red: '\u001b[31m',
  reset: '\u001b[0m',
};

function compareVersions() {
  const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.');

  const [releaseMajor, releaseMinor, releasePatch] = releaseVersion.split('.');

  if (releaseMajor < currentMajor) {
    return false;
  }
  if (releaseMajor > currentMajor) {
    return true;
  }
  if (releaseMinor < currentMinor) {
    return false;
  }
  if (releaseMinor > currentMinor) {
    return true;
  }
  if (releasePatch < currentPatch) {
    return false;
  }
  if (releasePatch > currentPatch) {
    return true;
  }

  return false;
}

if (!releaseVersion) {
  console.error(colors.red, 'Error: Please provide a valid version number', colors.reset);
} else if (!validVersion.test(releaseVersion)) {
  console.error(colors.red, 'Error: Invalid version number', colors.reset);
} else if (!compareVersions()) {
  console.error(
    colors.red,
    `Error: release version must be greater than the current version: ${currentVersion}`,
    colors.reset
  );
} else {
  execSync(
    `git commit --allow-empty -m "chore: release ${releaseVersion}" -m "Release-As: ${releaseVersion}"`,
    { cwd: resolve(__dirname, '..') }
  );
}
