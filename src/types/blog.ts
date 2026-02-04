export type BlogBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'heading'; level: 1 | 2 | 3; content: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'code'; code: string; language: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: BlogBlock[];
};
