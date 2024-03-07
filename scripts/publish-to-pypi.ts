import { setOutput } from '@actions/core';
import { exec } from '@actions/exec';
import { getPackagesSync } from '@manypkg/get-packages';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const PYPI_TOKEN = process.env.PYPI_TOKEN as string;

const pkg_meta = getPackagesSync(process.cwd());

const pkgJson = pkg_meta.rootPackage!.packageJson;

async function checkVersion() {
  const response = await fetch(`https://pypi.org/pypi/${pkgJson.name}/json`);
  const data = (await response.json()) as {
    releases?: Record<string, unknown>;
  };
  return !!data?.releases?.[pkgJson.version];
}

async function build() {
  await exec('pip', ['install', '-e', '.']);
  await exec('pnpm', ['run', 'build']);

  // check build results
  if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
    throw new Error('Build Failed');
  }
}

async function publish() {
  await exec('twine', [
    'upload',
    'dist/*',
    '--skip-existing',
    '-u',
    '__token__',
    '-p',
    PYPI_TOKEN,
  ]);
}

async function run() {
  const exists = await checkVersion();
  if (exists) {
    console.warn(
      `${pkgJson.name}@${pkgJson.version} already exists on PyPI, skip.`
    );
    return;
  }
  await build();
  await publish();
  setOutput('published', 'true');
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
