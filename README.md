# Replace On Save

Run a search and replace before saving a file, it also supports REGEX for automation of content clean.

## Extension Settings

Settings can be user or workspace settings.

To configure it only in the current workspace, edit the `.vscode/settings.json` file relative to the root of the project and add the following settings:

```json
// To enable the extension, disabled by default
"replaceOnSave.enabled": true,

// Configure replacement rules
"replaceOnSave.replacements": [
  {
    "languageIdentifiers": ["plaintext", "javascriptreact", ...],
    "rules": [
      {
        "search": "Search Text / JavaScript regex",
        "replace": "Replace Text",
        // Skip this rule in files matching a glob pattern
        "exclude": "**/test/**/*.js"
      },
      {
        ...
      }
    ]
  },
  {
    ...
  }
]
```

To see a list of language identifiers go to the following link:
https://code.visualstudio.com/docs/languages/identifiers

## Example Settings:

./.vscode/settings.json

```json
"replaceOnSave.enabled": true,
"replaceOnSave.replacements": [
  {
    "languageIdentifiers": ["plaintext"],
    "rules": [
      {
        "search": "dog",
        "replace": "cat"
      },
      {
        "search": "duck",
        "replace": "chicken",
        // Ignore all txt files in "ignore" directory for this rule
        "exclude": "**/ignore/*.txt"
      }
    ]
  },
  {
    "languageIdentifiers": ["javascriptreact", "jsx"],
    // Exclude jsx files in test directory from all rules in this replacement
    "exclude": "**/test/**/*.jsx",
    "rules": [
      {
        "search": "class=\"",
        "replace": "className=\"",
      }
    ]
  }
]
```

## Release Notes

### 2.1.0

- Add `exclude` replacement field to ignore all rules in replacement definition
  for files matching glob pattern
- Rewrite extension 🤡
  - Replacement edits are applied per-line when applicable rather than by replacing
    entire document contents. This should keep things speedy in larger documents.
  - Added output channel for logging

### 2.0.0

- Add `exclude` rule field to ignore search/replace in files matching glob patterns
- Update configuration and package.json `contributes` to allow vscode to provide
  completion for replace-on-save configuration options
  - This is a breaking change since it necessitates updating your settings

### 1.0.0

Initial release of Replace On Save
