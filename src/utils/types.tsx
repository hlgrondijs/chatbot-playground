export interface ChatMessage {
  ts: Date;
  content: string;
  user: string;
}

export interface AssistantSession {
  messageHistory: ChatMessage[];
  title: string;
  ts: Date;
}
