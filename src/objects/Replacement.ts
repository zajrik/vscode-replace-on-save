import { minimatch } from 'minimatch';
import { TextDocument } from 'vscode';
import { ConfigReplacement } from '../config/ConfigReplacement';
import { Rule } from './Rule';

/**
 * Object holding `rules` for replacing text in files matching configured
 * `languages`.
 */
export class Replacement {
  public languages: Set<string>;
  public excludePattern?: string;
  public rules: Rule[];

  public constructor(config: ConfigReplacement) {
    this.languages = new Set(config.languageIdentifiers);
    this.excludePattern = config.exclude;
    this.rules = config.rules.map(Rule.fromConfig);
  }

  /**
   * Constructs a `Replacement` from the given `ConfigReplacement`.
   */
  public static fromConfig(config: ConfigReplacement) {
    return new Replacement(config);
  }

  /**
   * Returns whether the given `document` should be excluded by this replacement.
   */
  public shouldExclude(document: TextDocument): boolean {
    return this.excludePattern !== undefined
      && this.excludePattern !== null
      && minimatch(document.fileName, this.excludePattern);
  }

  /**
   * Returns whether this replacement is applicable to the given `document` based
   * on its `TextDocument.languageId` and this replacement's exclude pattern.
   */
  public isApplicableTo(document: TextDocument): boolean {
    return this.languages.has(document.languageId) && !this.shouldExclude(document);
  }

  /**
   * Returns all replacement rules that are applicable to the given `document`
   * based on the rules' exclude patterns.
   */
  public applicableRulesFor(document: TextDocument): Rule[] {
    return this.rules.filter(rule => !rule.shouldExclude(document));
  }
}
