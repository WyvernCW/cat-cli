/**
 * CAT.md Schema
 */
export interface CatMd {
  overview?: string;
  technologies?: string[];
  architecture?: string;
  conventions?: string;
  commands?: Record<string, string>;
  files?: string[];
  knowledge?: string;
  overrides?: {
    style?: string;
    search?: boolean;
    temperature?: number;
    extra_context?: string;
  };
}
