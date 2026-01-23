/**
 * Describes a replacement rule from extension configuration.
 */
export interface ConfigRule {
  search: string;
  replace: string;
  exclude?: string;
}
