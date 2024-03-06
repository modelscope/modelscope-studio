export interface ChangesetMeta {
  dir: string;
  current_changelog: string;
  feat: { summary: string }[];
  fix: { summary: string }[];
  chore: { summary: string }[];
}

export interface ChangesetMetaCollection {
  [key: string]: ChangesetMeta | string[];
  _handled: string[];
}
