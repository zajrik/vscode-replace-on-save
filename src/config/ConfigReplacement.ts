import { ConfigRule } from './ConfigRule';

/**
 * Describes a replacement from extension configuration.
 */
export interface ConfigReplacement {
  languageIdentifiers: string[];
  exclude?: string;
  rules: ConfigRule[];
}
