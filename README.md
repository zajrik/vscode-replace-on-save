# Replace On Save

Run a search and replace before saving a file, it also supports REGEX for automation of content clean.

## Extension Settings

Settings can be user or workspace settings.

To configure it only in the current workspace, edit the `.vscode/settings.json` file relative to the root of the project and add the following settings:

```
"replaceOnSave.enabled": true, // or false
"replaceOnSave.replacements": [
  {
    "languageIdentifiers": ["plaintext", "javascriptreact", ...],
    "rules": [
      {
        "search": "Search Text / JavaScript regex",
        "replace": "Replace Text",
        // Exclude search/replace in files matching a glob pattern
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

```
"replaceOnSave.enabled": true,
"replaceOnSave.replacements": [
  {
    "languageIdentifiers": ["plaintext"],
    "rules": [
      {
        "search": "dog", // This can be a valid javascript regular expression
        "replace": "cat"
      },
      {
        "search": "duck",
        "replace": "chicken"
      }
    ]
  },
  {
    "languageIdentifiers": ["javascriptreact", "jsx"],
    "rules": [
      {
        "search": "class=\"",
        "replace": "className=\"",
        "exclude": "**/test/**/*.js"
      }
    ]
  }
]
```

## Release Notes

### 2.0.0

- Add `exclude` rule field to ignore search/replace in files matching glob patterns
- Update configuration and package.json `contributes` to allow vscode to provide
  completion for replace-on-save configuration options
  - This is a breaking change since it necessitates updating your settings

### 1.0.0

Initial release of Replace On Save
