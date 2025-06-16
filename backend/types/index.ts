// types/types.ts

// TODO: Add more types later
export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  profilePicture: string;
}

export interface Debate {
  id: string;
  topicId: number;
  priv: number;
  closed: boolean;
  started: Date;
}

export interface Justification {
  id: number;
  content: string;
  createdAt: Date;
  authorId: string;
  stanceId: number;
}

export interface Topic {
  id: number;
  title: string;
}
