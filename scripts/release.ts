/* eslint-disable no-console */
// Import necessary modules
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Extract the release version from the command line arguments
const { 2: releaseVersion } = process.argv;

// Get the current version from the environment variables
// const currentVersion = process.env.npm_package_version as string;
const currentVersion = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8')
).version;

// Define a regular expression for a valid version number
const validVersion = /^([0-9]|[1-9][0-9]+).([0-9]|[1-9][0-9]+).([0-9]|[1-9][0-9]+)$/gu;

// Define ANSI color codes for console output
const colors = {
  red: '\u001b[31m',
  reset: '\u001b[0m',
};

// Function to compare release version with the current version
function compareVersions() {
  const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.');
  const [releaseMajor, releaseMinor, releasePatch] = releaseVersion.split('.');

  if (releaseMajor < currentMajor) return false;
  if (releaseMajor > currentMajor) return true;
  if (releaseMinor < currentMinor) return false;
  if (releaseMinor > currentMinor) return true;
  if (releasePatch < currentPatch) return false;
  if (releasePatch > currentPatch) return true;

  return false;
}

// Check if the release version is provided
if (!releaseVersion) {
  // Check if it's running in GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    // Extract tag name from GITHUB_REF
    console.log('GITHUB_REF:', process.env.GITHUB_REF);

    const isTag = process.env.GITHUB_REF?.startsWith('refs/tags/');
    console.log('isTag:', isTag);

    if (isTag) {
      const tag = process.env.GITHUB_REF?.replace('refs/tags/', '');
      console.log('Tag:', tag);

      execSync(`npm version ${tag} -m "chore: release ${tag}"`, {
        cwd: resolve(__dirname, '..'),
      });

      // Generate the changelog
      execSync(`yarn run changelog`, {
        cwd: resolve(__dirname, '..'),
      });

      // Commit the changes
      execSync(`git add -A && git commit -m "chore: release ${tag}"`, {
        cwd: resolve(__dirname, '..'),
      });

      console.log(`Released version: ${tag}`);
    } else {
      console.error(
        colors.red,
        'Error: Please provide a valid version number',
        colors.reset
      );
    }
  } else {
    console.error(
      colors.red,
      'Error: Please provide a valid version number',
      colors.reset
    );
  }
}
// Check if the release version is a valid version number
else if (!validVersion.test(releaseVersion)) {
  console.error(colors.red, 'Error: Invalid version number', colors.reset);
}
// Check if the release version is greater than the current version
else if (!compareVersions()) {
  console.error(
    colors.red,
    `Error: release version must be greater than the current version: ${currentVersion}`,
    colors.reset
  );
}
// If all checks pass, create a release commit and update version
else {
  execSync(
    `git add -A && git commit --allow-empty -m "chore: release ${releaseVersion}"`,
    {
      cwd: resolve(__dirname, '..'),
    }
  );

  execSync(`git push origin main --follow-tags`, {
    cwd: resolve(__dirname, '..'),
  });
}
