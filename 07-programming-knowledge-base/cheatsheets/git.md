# Git Advanced Cheatsheet

## Interactive Rebase & Cleanup
```bash
git fetch origin
git rebase -i origin/main
git commit --amend --no-edit
```

## Bisect Bug Hunting
```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
git bisect run pytest tests/
```

## Worktrees (Concurrent Branch Work)
```bash
git worktree add ../feature-branch feature/new-pipeline
git worktree list
git worktree remove ../feature-branch
```
