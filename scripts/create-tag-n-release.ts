import { exec } from '@actions/exec';
import { getOctokit } from '@actions/github';
import { getPackagesSync } from '@manypkg/get-packages';
import fs from 'fs';
import path from 'path';

const githubToken = process.env.GITHUB_TOKEN as string;
const repo = process.env.REPO as string;
const owner = process.env.OWNER as string;
const pkg_meta = getPackagesSync(process.cwd());

const octokit = getOctokit(githubToken);

function getChangelogEntry(changelog: string, startVersion: string) {
  const regex = new RegExp(`^#{2}\\s*${startVersion}.*?^(?=#{2})`, 'ms');
  const match = changelog.match(regex);

  if (match && match.index) {
    const nextVersionRegex = /^#{2}\s(.*)/;
    const lines = changelog
      .substring(match.index + match[0].length)
      .split('\n');
    const results: string[] = [];
    for (const line of lines) {
      if (nextVersionRegex.test(line)) {
        if (!results[results.length - 1]) {
          return results.slice(0, -1).join('\n');
        }
        return results.join('\n');
      } else {
        results.push(line);
      }
    }
    return results.join('\n');
  }

  return '';
}

const getChangelog = (version: string) => {
  const rootChangelog = fs.readFileSync(
    path.join(pkg_meta.rootDir, 'CHANGELOG.md'),
    'utf-8'
  );

  const rootChangelogEntry = getChangelogEntry(rootChangelog, version);
  if (!rootChangelogEntry) {
    // we can find a changelog but not the entry for this version
    // if this is true, something has probably gone wrong
    throw new Error(`Could not find root changelog entry for ${version}`);
  }
  let changelog = `# ${pkg_meta.rootPackage?.packageJson.name}

## ${pkg_meta.rootPackage?.packageJson.name}@${version}

${rootChangelogEntry}`;
  pkg_meta.packages
    .filter(
      (pkg) => pkg.packageJson.name !== pkg_meta.rootPackage?.packageJson.name
    )
    .forEach((pkg) => {
      const changelogEntry = getChangelogEntry(
        fs.readFileSync(path.join(pkg.dir, 'CHANGELOG.md'), 'utf-8'),
        version
      );
      if (changelogEntry) {
        changelog += `\n\n## ${pkg.packageJson.name}@${version}

${changelogEntry}`;
      }
    });
  return changelog;
};

const createTag = async (version: string) => {
  const tag = `v${version}`;
  await exec('git', ['tag', '-a', tag, '-m', tag]);
  await exec('git', ['push', 'origin', tag]);
  return tag;
};

const createRelease = async (
  version: string,
  tag: string,
  changelog: string
) => {
  try {
    await octokit.rest.repos.createRelease({
      name: tag,
      tag_name: tag,
      owner,
      repo,
      body: changelog,
      prerelease: version.includes('-'),
    });
    // eslint-disable-next-line no-console
    console.log(`${tag} released`);
  } catch (err) {
    // if we can't find a changelog, the user has probably disabled changelogs
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      err.code !== 'ENOENT'
    ) {
      throw err;
    }
  }
};

async function run() {
  const version = pkg_meta.rootPackage?.packageJson.version;
  if (!version) {
    throw new Error('No root package version found');
  }
  const changelog = getChangelog(version);
  const tag = await createTag(version);
  await createRelease(version, tag, changelog);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
