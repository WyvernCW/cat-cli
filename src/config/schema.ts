/**
 * CAT CLI Configuration Schema
 */
export type Style = 'default' | 'formal' | 'casual' | 'concise' | 'detailed' | 'technical' | 'socratic' | 'creative' | 'hacker';

export type ThemeName = 'default' | 'dark' | 'midnight' | 'forest' | 'rose' | 'ocean' | 'gold' | 'sepia' | 'hacker';

export interface Theme {
  accent: string;
  muted: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  user_label: string;
  ai_label: string;
  code_dim: string;
}

export interface Config {
  nvidia_api_key: string;
  brave_search_api_key?: string;
  style: Style;
  theme: ThemeName;
  search_enabled: boolean;
  memory_enabled: boolean;
  welcome_enabled: boolean;
  max_turns_headless: number;
  custom_about_user?: string;
  custom_response_prefs?: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
}
