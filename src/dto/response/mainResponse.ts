export interface IMainResponse {
  id: number,
  type: string,
  content: string,
  canOpen: boolean,
  categoryId: number,
  isShown: boolean,
  voice: string | null,
  subtitle: string
};