import { TextEdit, TextLine } from 'vscode';
import { Rule } from './Rule';

/**
 * Object facilitating replacement of text in the given document `TextLine` via
 * application of the given `rules`.
 */
export class LineReplacement {
  public documentLine: TextLine;
  public replacedText: string;

  public constructor(documentLine: TextLine, rules: Rule[]) {
    this.documentLine = documentLine;
    this.replacedText = LineReplacement._apply(documentLine, rules);
  }

  /**
   * Returns whether this line replacement has any changes from the original text.
   */
  public hasChanges(): boolean {
    return this.replacedText !== this.documentLine.text;
  }

  /**
   * Returns a `TextEdit` to apply this line replacement to the document.
   *
   * Make sure to filter for replacements that have actual changes before applying.
   */
  public toTextEdit(): TextEdit {
    return TextEdit.replace(this.documentLine.range, this.replacedText);
  }

  /**
   * Returns `documentLine` text with the given replacement `rules` applied.
   */
  private static _apply(documentLine: TextLine, rules: Rule[]): string {
    // Return line unmodified if it is empty
    if (documentLine.isEmptyOrWhitespace) {
      return documentLine.text;
    }

    return rules.reduce(
      (acc, it) => it.applyTo(acc),
      documentLine.text
    );
  }
}
