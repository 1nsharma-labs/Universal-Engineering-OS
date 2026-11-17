/**
 * Lightweight LCS Line-by-Line Unified Diff Engine for UNIFORGE Workbench Diff View.
 */

export interface DiffLine {
  type: 'same' | 'added' | 'removed';
  oldLine?: number;
  newLine?: number;
  text: string;
}

export interface FileDiffSummary {
  lines: DiffLine[];
  additions: number;
  deletions: number;
}

export function computeLineDiff(beforeText: string, afterText: string): FileDiffSummary {
  const a = beforeText ? beforeText.split('\n') : [];
  const b = afterText ? afterText.split('\n') : [];
  const m = a.length;
  const n = b.length;

  // Fast guard for very large files
  if (m * n > 120000) {
    const lines: DiffLine[] = [
      ...a.map((text, idx) => ({ type: 'removed' as const, oldLine: idx + 1, text })),
      ...b.map((text, idx) => ({ type: 'added' as const, newLine: idx + 1, text })),
    ];
    return { lines, additions: b.length, deletions: a.length };
  }

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = dp[i + 1][j] >= dp[i][j + 1] ? dp[i + 1][j] : dp[i][j + 1];
      }
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let additions = 0;
  let deletions = 0;

  while (i < m && j < n) {
    if (a[i] === b[j]) {
      lines.push({ type: 'same', oldLine: i + 1, newLine: j + 1, text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      lines.push({ type: 'removed', oldLine: i + 1, text: a[i] });
      deletions++;
      i++;
    } else {
      lines.push({ type: 'added', newLine: j + 1, text: b[j] });
      additions++;
      j++;
    }
  }
  while (i < m) {
    lines.push({ type: 'removed', oldLine: i + 1, text: a[i] });
    deletions++;
    i++;
  }
  while (j < n) {
    lines.push({ type: 'added', newLine: j + 1, text: b[j] });
    additions++;
    j++;
  }

  return { lines, additions, deletions };
}

