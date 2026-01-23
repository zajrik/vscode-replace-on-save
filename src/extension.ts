import {
  Disposable,
  OutputChannel,
  TextDocument,
  TextDocumentWillSaveEvent,
  TextEdit,
  window,
  workspace
} from 'vscode';
import { ConfigReplacement } from './config/ConfigReplacement';
import { LineReplacement } from './objects/LineReplacement';
import { Replacement } from './objects/Replacement';
import { Rule } from './objects/Rule';

const EXTENSION_NAME: string = 'Replace On Save';
const EXTENSION_CONFIG_NAME: string = 'replaceOnSave';
const EXTENSION_CONFIG_ENABLED: string = 'enabled';
const EXTENSION_CONFIG_REPLACEMENTS: string = 'replacements';

const outputChannel: OutputChannel = window.createOutputChannel(EXTENSION_NAME);

let settingChangeListener: Disposable;
let documentSaveListener: Disposable;

let configEnabled: boolean = false;
let configReplacements: Replacement[] = [];
let configLanguages: Set<string> = new Set();

export function activate(): void {
  outputChannel.appendLine(`${EXTENSION_NAME} activated.`);
  settingChangeListener = workspace.onDidChangeConfiguration(onConfigurationChange);
  documentSaveListener = workspace.onWillSaveTextDocument(onWillSave);
}

export function deactivate(): void {
  outputChannel.appendLine(`${EXTENSION_NAME} deactivated.`);
  settingChangeListener.dispose();
  documentSaveListener.dispose();
  outputChannel.dispose();
}

/**
 * `onDidChangeConfiguration` event handler.
 */
function onConfigurationChange(): void {
  outputChannel.appendLine('Config changed, reloading config');

  configEnabled = workspace
    .getConfiguration(EXTENSION_CONFIG_NAME)
    .get(EXTENSION_CONFIG_ENABLED) ?? false;

  // Skip processing replacements if extension is disabled
  if (!configEnabled) {
    outputChannel.appendLine('Extension is disabled');
    return;
  }

  const replacementConfigs: ConfigReplacement[] = workspace
    .getConfiguration(EXTENSION_CONFIG_NAME)
    .get(EXTENSION_CONFIG_REPLACEMENTS) ?? [];

  configReplacements = replacementConfigs.map(Replacement.fromConfig);
  configLanguages = configReplacements
    .map(it => it.languages)
    .reduce((a, b) => new Set([...a, ...b]));

  outputChannel.appendLine([
    `Replacements loaded. Affected language identifiers: `,
    `${Array.from(configLanguages).join(', ')}`,
  ].join(''));
}

/**
 * `onWillSaveTextDocument` event handler.
 */
function onWillSave(event: TextDocumentWillSaveEvent) {
  // Discard event if extension is not enabled
  if (!configEnabled) { return; }

  const document: TextDocument = event.document;

  // Discard event if document type has no applicable replacements
  if (!configLanguages.has(document.languageId)) { return; }

  // Gather applicable replacement rules for document
  const rules: Rule[] = configReplacements
    .filter(it => it.isApplicableTo(document))
    .map(it => it.applicableRulesFor(document))
    .reduce((a, b) => a.concat(b), []);

  // Discard event if there are no applicable replacement rules
  if (rules.length < 1) { return; }

  // Gather document edits to apply
  const edits: TextEdit[] = Array(document.lineCount)
    .fill(0)
    .map((_, index) => new LineReplacement(document.lineAt(index), rules))
    .filter(it => it.hasChanges())
    .map(it => it.toTextEdit());

  // Discard event if there are no edits to be applied
  if (edits.length < 1) { return; }

  outputChannel.appendLine(`Applying replacements to file: ${document.fileName}`);
  event.waitUntil(Promise.resolve(edits));
}
