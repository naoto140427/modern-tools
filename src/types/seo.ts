export type SeoInfo = {
  title: string;
  description: string;
  keywords: string[];
};

export type ToolSeoConfig = {
  en: SeoInfo;
  ja: SeoInfo;
};
