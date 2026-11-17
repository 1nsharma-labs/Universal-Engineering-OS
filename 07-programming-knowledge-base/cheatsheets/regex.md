# Modern Regex Cheatsheet

## Positive and Negative Lookaround
```regex
# Positive Lookahead: Match 'USD' preceded by numbers
(?<=\d+)\s*USD

# Negative Lookahead: Match 'error' not followed by 'ignored'
error(?!\s*ignored)
```

## Named Capture Groups
```regex
(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})
```
