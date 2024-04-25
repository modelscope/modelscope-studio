import { getPackagesSync, type Package } from '@manypkg/get-packages';
import detectIndent from 'detect-indent';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

import { ChangesetMeta, ChangesetMetaCollection } from './type';

const pkg_meta = getPackagesSync(process.cwd());

function updatePackageJson(pkgJsonPath: string, pkgJson: any) {
  const pkgRaw = readFileSync(pkgJsonPath, 'utf-8');
  const indent = detectIndent(pkgRaw).indent || '  ';
  const stringified =
    JSON.stringify(pkgJson, null, indent) + (pkgRaw.endsWith('\n') ? '\n' : '');

  writeFileSync(pkgJsonPath, stringified);
}

function run() {
  if (!existsSync(join(pkg_meta.rootDir, '.changeset', '_changelog.json'))) {
    console.warn('No changesets to process');
    return;
  }

  const { _handled, ...packages } = JSON.parse(
    readFileSync(
      join(pkg_meta.rootDir, '.changeset', '_changelog.json'),
      'utf-8'
    )
  ) as ChangesetMetaCollection;

  const all_packages = pkg_meta.packages.reduce(
    (acc, pkg) => {
      acc[pkg.packageJson.name] = pkg;
      return acc;
    },
    {} as Record<string, Package>
  );

  const version = pkg_meta.rootPackage?.packageJson.version;
  if (!version) {
    throw new Error('No root package version found');
  }

  for (const pkg_name in packages) {
    const { dir, chore, feat, fix, current_changelog } = packages[
      pkg_name
    ] as ChangesetMeta;

    const features = feat.map((f) => `- ${f.summary}`);
    const fixes = fix.map((f) => `- ${f.summary}`);
    const others = chore.map((f) => `- ${f.summary}`);

    const release_notes = (
      [
        [features, '### Features'],
        [fixes, '### Fixes'],
        [others, '### Misc Changes'],
      ] as const
    )
      .filter(([s]) => s.length > 0)
      .map(([lines, title]) => {
        return `${title}\n\n${lines.join('\n')}`;
      })
      .join('\n\n');

    const new_changelog = `# ${pkg_name}

## ${version}

${release_notes}

${current_changelog.replace(`# ${pkg_name}`, '').trim()}
`.trim();
    writeFileSync(join(dir, 'CHANGELOG.md'), new_changelog);
  }

  bump_packages(version);

  unlinkSync(join(pkg_meta.rootDir, '.changeset', '_changelog.json'));

  function bump_packages(newVersion: string) {
    for (const pkg_name in all_packages) {
      const { dir, packageJson } = all_packages[pkg_name];
      const newPackageJson = {
        ...packageJson,
      };
      newPackageJson.version = newVersion;
      updatePackageJson(join(dir, 'package.json'), newPackageJson);
      if (packages[pkg_name]) {
        continue;
      }
      const current_changelog_path = join(dir, 'CHANGELOG.md');
      const current_changelog = existsSync(current_changelog_path)
        ? readFileSync(current_changelog_path, 'utf-8')
        : '';

      const new_changelog = `# ${pkg_name}

## ${version}

No significant changes to this package were made in this release.

${current_changelog.replace(`# ${pkg_name}`, '').trim()}
    `.trim();
      writeFileSync(join(dir, 'CHANGELOG.md'), new_changelog);
    }
    const version_path = join(
      pkg_meta.rootDir,
      'backend/modelscope_studio/version.py'
    );
    const versionPy = readFileSync(version_path, 'utf-8');
    writeFileSync(
      version_path,
      versionPy.replace(/__version__ = ".+"/, `__version__ = "${newVersion}"`)
    );
    const pyproject_path = join(pkg_meta.rootDir, 'pyproject.toml');
    const pyproject = readFileSync(pyproject_path, 'utf-8');
    writeFileSync(
      pyproject_path,
      pyproject.replace(/version = ".+"/, `version = "${newVersion}"`)
    );
  }
}

run();
