import { getInfo, getInfoFromPullRequest } from '@changesets/get-github-info';
import type { ChangelogFunctions } from '@changesets/types';
import { getPackagesSync } from '@manypkg/get-packages';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import type { ChangesetMeta, ChangesetMetaCollection } from './type';

const { packages, rootDir } = getPackagesSync(process.cwd());

function find_packages_dir(package_name: string) {
  const _package = packages.find((p) => p.packageJson.name === package_name);
  if (!_package) throw new Error(`Package ${package_name} not found`);

  return _package.dir;
}

/**
 * @param {string} str The changelog entry
 * @param {string} prefix The prefix to add to the first line
 * @param {string} suffix The suffix to add to the last line
 * @returns {string} The formatted changelog entry
 */
function handle_line(str: string, prefix: string, suffix: string): string {
  const [_s, ...lines] = str.split('\n').filter(Boolean);

  const desc = `${prefix ? `${prefix} -` : ''} ${_s.replace(
    /[\s.]$/,
    ''
  )}. ${suffix}`;

  if (_s.length === 1) {
    return desc;
  }

  return [desc, ...lines.map((l) => `  ${l}`)].join('/n');
}

const changelogFunctions: ChangelogFunctions = {
  getDependencyReleaseLine: async (
    changesets,
    dependenciesUpdated,
    options
  ) => {
    if (!options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]'
      );
    }
    if (dependenciesUpdated.length === 0) return '';

    const changesetLink = `- Updated dependencies [${(
      await Promise.all(
        changesets.map(async (cs) => {
          if (cs.commit) {
            const { links } = await getInfo({
              repo: options.repo,
              commit: cs.commit,
            });
            return links.commit;
          }
        })
      )
    )
      .filter((_) => _)
      .join(', ')}]:`;

    const updatedDepenenciesList = dependenciesUpdated.map(
      (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
    );

    return [changesetLink, ...updatedDepenenciesList].join('\n');
  },
  getReleaseLine: async (changeset, type, options) => {
    if (!options || !options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["@changesets/changelog-github", { "repo": "org/repo" }]'
      );
    }

    let prFromSummary: number | undefined;
    let commitFromSummary: string | undefined;
    const usersFromSummary: string[] = [];

    const replacedChangelog = changeset.summary
      .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
        const num = Number(pr);
        if (!isNaN(num)) prFromSummary = num;
        return '';
      })
      .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
        commitFromSummary = commit;
        return '';
      })
      .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
        usersFromSummary.push(user);
        return '';
      })
      .trim();

    const [firstLine, ...futureLines] = replacedChangelog
      .split('\n')
      .map((l) => l.trimEnd());

    const links = await (async () => {
      if (prFromSummary !== undefined) {
        let { links: _links } = await getInfoFromPullRequest({
          repo: options.repo,
          pull: prFromSummary,
        });
        if (commitFromSummary) {
          const shortCommitId = commitFromSummary.slice(0, 7);
          _links = {
            ..._links,
            commit: `[\`${shortCommitId}\`](https://github.com/${options.repo}/commit/${commitFromSummary})`,
          };
        }
        return _links;
      }
      const commitToFetchFrom = commitFromSummary || changeset.commit;
      if (commitToFetchFrom) {
        const info = await getInfo({
          repo: options.repo,
          commit: commitToFetchFrom,
        });
        return info.links;
      }
      return {
        commit: null,
        pull: null,
        user: null,
      };
    })();

    const users = usersFromSummary.length
      ? usersFromSummary
          .map(
            (userFromSummary) =>
              `[@${userFromSummary}](https://github.com/${userFromSummary})`
          )
          .join(', ')
      : links.user;

    const prefix = [
      links.pull === null ? '' : `${links.pull}`,
      links.commit === null ? '' : `${links.commit}`,
    ]
      .join(' ')
      .trim();

    const suffix = users === null ? '' : ` Thanks ${users}!`;

    let lines: ChangesetMetaCollection = {
      _handled: [],
    };
    if (existsSync(join(rootDir, '.changeset', '_changelog.json'))) {
      lines = JSON.parse(
        readFileSync(join(rootDir, '.changeset', '_changelog.json'), 'utf-8')
      );
    }

    if (lines._handled.includes(changeset.id)) {
      return 'done';
    }
    lines._handled.push(changeset.id);

    changeset.releases.forEach((release) => {
      if (!lines[release.name]) {
        lines[release.name] = {
          dir: find_packages_dir(release.name),
          current_changelog: '',
          feat: [],
          fix: [],
          chore: [],
        };
      }

      const changelog_path = join(
        (lines[release.name] as ChangesetMeta).dir,
        'CHANGELOG.md'
      );

      if (existsSync(changelog_path)) {
        (lines[release.name] as ChangesetMeta).current_changelog = readFileSync(
          changelog_path,
          'utf-8'
        )
          .replace(`# ${release.name}`, '')
          .trim();
      }

      const [, _type, summary] = changeset.summary
        .trim()
        .match(/^(.+)\s*:\s*([^]*)/im) || [null, 'chore', changeset.summary];

      const formatted_summary = handle_line(summary, prefix, suffix);

      const convertedType =
        _type === 'feat' || _type === 'fix' ? _type : 'chore';

      (lines[release.name] as ChangesetMeta)[convertedType].push({
        summary: formatted_summary,
      });
    });

    writeFileSync(
      join(rootDir, '.changeset', '_changelog.json'),
      JSON.stringify(lines, null, 2)
    );

    return `\n\n-${prefix ? `${prefix} -` : ''} ${firstLine}\n${futureLines
      .map((l) => `  ${l}`)
      .join('\n')}`;
  },
};

export default changelogFunctions;
