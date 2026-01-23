import { minimatch } from 'minimatch';
import { TextDocument } from 'vscode';
import { ConfigRule } from '../config/ConfigRule';

/**
 * Object facilitating applying configured text replacements where applicable.
 */
export class Rule {
  public searchRegex: RegExp;
  public replaceText: string;
  public excludePattern?: string;

  public constructor(config: ConfigRule) {
    this.searchRegex = new RegExp(config.search, 'g');
    this.replaceText = config.replace;
    this.excludePattern = config.exclude;
  }

  /**
   * Constructs a `Rule` from the given `ConfigRule`.
   */
  public static fromConfig(config: ConfigRule): Rule {
    return new Rule(config);
  }

  /**
   * Returns whether the given `document` should be excluded by this rule.
   */
  public shouldExclude(document: TextDocument): boolean {
    return this.excludePattern !== undefined
      && this.excludePattern !== null
      && minimatch(document.fileName, this.excludePattern);
  }

  /**
   * Returns `line` with this rule applied to it.
   */
  public applyTo(line: string): string {
    return line.replace(this.searchRegex, this.replaceText);
  }
}
