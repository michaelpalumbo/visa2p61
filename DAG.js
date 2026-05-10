#!/usr/bin/env node

/**
 * extract.js
 * Extracts git DAG data from a folder of student repos and outputs data.json
 *
 * Usage:
 *   node extract.js --repos ./path/to/repos --out ./path/to/output
 *
 * Defaults:
 *   --repos  ./repos
 *   --out    ./   (writes data.json in current directory)
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const reposDir = path.resolve(get("--repos") || "-repos");
const outDir = path.resolve(get("--out") || "./");

// ── Helpers ───────────────────────────────────────────────────────────────────
function git(repoPath, command) {
  return execSync(`git -C "${repoPath}" ${command}`, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

function getRemoteUrl(repoPath) {
  try {
    const url = git(repoPath, `remote get-url origin`);
    // Normalise SSH → HTTPS: git@github.com:user/repo.git → https://github.com/user/repo
    return url
      .replace(/^git@github\.com:/, "https://github.com/")
      .replace(/\.git$/, "");
  } catch {
    return null;
  }
}

function getAuthor(repoPath) {
  // Try to get the most common author name in the repo (likely the student)
  try {
    const output = git(
      repoPath,
      `log --all --format="%an" | sort | uniq -c | sort -rn | head -1`
    );
    // output looks like "  42 Student Name"
    return output.replace(/^\s*\d+\s+/, "").trim();
  } catch {
    return "Unknown";
  }
}

function getCommits(repoPath) {
  // Format: hash|parentHashes|subject|date|authorName
  // %P = space-separated parent hashes, empty for root commits
  const raw = git(
    repoPath,
    `log --all --format="%H|%P|%s|%ad|%an" --date=format:"%Y-%m-%d %H:%M"`
  );

  if (!raw) return [];

  return raw.split("\n").map((line) => {
    const [hash, parentsRaw, subject, date, author] = line.split("|");
    const parents = parentsRaw ? parentsRaw.trim().split(" ").filter(Boolean) : [];
    return {
      hash: hash.trim(),
      hashShort: hash.trim().slice(0, 7),
      parents,
      subject: subject ? subject.trim().slice(0, 72) : "", // truncate long messages
      date: date ? date.trim() : "",
      author: author ? author.trim() : "",
    };
  });
}

function getBranches(repoPath) {
  // Get all remote branches (origin/*), strip the origin/ prefix
  const raw = git(repoPath, `branch -r --format="%(refname:short)|%(objectname)"`);
  if (!raw) return [];

  return raw
    .split("\n")
    .map((line) => {
      const [ref, hash] = line.split("|");
      const name = ref.trim().replace(/^origin\//, "").replace(/^HEAD$/, "").trim();
      return name ? { name, hash: hash.trim() } : null;
    })
    .filter(Boolean)
    .filter((b) => b.name !== "HEAD");
}

function getTags(repoPath) {
  try {
    const raw = git(repoPath, `tag -l`);
    return raw ? raw.split("\n").map((t) => t.trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
if (!fs.existsSync(reposDir)) {
  console.error(`Error: repos directory not found: ${reposDir}`);
  process.exit(1);
}

const repoDirs = fs
  .readdirSync(reposDir)
  .map((name) => ({ name, fullPath: path.join(reposDir, name) }))
  .filter(({ fullPath }) => {
    try {
      git(fullPath, "rev-parse --git-dir");
      return true;
    } catch {
      return false; // skip non-git folders
    }
  });

if (repoDirs.length === 0) {
  console.error(`No git repos found in: ${reposDir}`);
  process.exit(1);
}

console.log(`Found ${repoDirs.length} repos in ${reposDir}\n`);

const result = repoDirs.map(({ name, fullPath }) => {
  process.stdout.write(`Processing ${name}... `);
  try {
    const commits = getCommits(fullPath);
    const branches = getBranches(fullPath);
    const tags = getTags(fullPath);
    const author = getAuthor(fullPath);
    const remoteUrl = getRemoteUrl(fullPath);

    console.log(`${commits.length} commits, ${branches.length} branches`);

    return {
      repo: name,
      author,
      remoteUrl,
      commits,
      branches,
      tags,
    };
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    return { repo: name, author: "Unknown", remoteUrl: null, commits: [], branches: [], tags: [], error: err.message };
  }
});

const outPath = path.join(outDir, "data.json");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));

console.log(`\nWrote ${outPath}`);