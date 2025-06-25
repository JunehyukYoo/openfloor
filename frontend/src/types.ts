// types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface Debate {
  id: string;
  private: boolean;
  started: Date;
  closed: boolean;
  topicId: number;
  topic?: Topic;
  creatorId: string;
  creator?: User;
  stances?: Stance[];
}

export interface Participant {
  id: number;
  userId: string;
  debateId: string;
  stanceId?: number;
  role: "CREATOR" | "ADMIN" | "DEBATER" | "OBSERVER";
  joinedAt: Date;
  user?: User;
  debate?: Debate;
  stance?: Stance;
}

export interface Topic {
  id: number;
  title: string;
  debates?: Debate[];
}

export interface Stance {
  id: number;
  label: string;
  debateId: string;
  debate?: Debate;
  justifications?: Justification[];
  participants?: Participant[];
}

export interface Justification {
  id: number;
  content: string;
  stanceId: number;
  createdAt: Date;
  updatedAt: Date;
  stance?: Stance;
  votes?: Vote[];
  comments?: Comment[];
}

export interface Vote {
  id: number;
  value: number; // 1 for upvote, -1 for downvote

  userId: string;
  user?: User;
  createdAt: Date;

  justificationId: number;
  justification?: Justification;
}

export interface Comment {
  id: number;
  content: string;
  justificationId: number;
  justification?: Justification;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  parentId: number | null;
  parent?: Comment;
  children?: Comment[];
}

// SIDEBAR

export interface TopicDataMini {
  id: string;
  title: string;
}

// DEBATES

export interface DebateDataMini {
  id: number;
  userId: string;
  stanceId?: number;
  role: "CREATOR" | "ADMIN" | "DEBATER" | "OBSERVER";
  joinedAt: Date;
  debate: Debate;
}

export interface Quote {
  text: string;
  author: string;
  tags?: string[];
  id?: number;
  author_id?: string;
}

// TODO: Add justifications, comments, and votes to the debate data
export interface DebateDataFull {
  id: string;
  private: boolean;
  started: Date;
  closed: boolean;
  topicId: number;
  topic: {
    id: number;
    title: string;
    debates: Debate[];
  };
  creator: User;
  creatorId: string;
  participants: {
    id: number;
    userId: string;
    debateId: string;
    stanceId?: number;
    role: "CREATOR" | "ADMIN" | "DEBATER" | "OBSERVER";
    joinedAt: Date;
    user: User;
  }[];
  stances: Stance[];
}

export interface SupportDetails {
  stanceId: number;
  stanceLabel: string;
  supportCount: number;
}

// TOPICS

export interface DebateData {
  id: string;
  private: boolean;
  started: Date;
  closed: boolean;
  topicId: number;
  participantCount: number;
  creatorId: string;
  creatorUsername: string;
}

export interface AllTopicData {
  allTopics: TopicData[];
  trendingTopics: TrendingTopicsData[];
  recommendedTopics: TopicData[];
}

export interface TopicData {
  id: number;
  title: string;
  totalCount: number;
  debates: DebateData[];
}

export interface TrendingTopicsData {
  id: number;
  title: string;
  totalCount: number;
  debates: DebateData[];
  recentPublicDebateCount: number;
}

// ANALYTICS

export interface RadialBarChartData {
  name: string;
  count: number;
  fill: string;
}

export interface ParticipantStats {
  role: string;
  _count: number;
}

export interface ActivityOverTime {
  date: string;
  debates: number;
  justifications: number;
  comments: number;
  votes: number;
}

export interface AnalyticsData {
  participation: {
    totalDebates: number;
    activeDebates: number;
    privateDebates: number;
    participantStats: ParticipantStats[];
  };
  contributions: {
    totalJustifications: number;
    totalComments: number;
    totalVotesCast: number;
  };
  highlights: {
    mostParticipatedTopic?: {
      topic: {
        title: string;
      };
      count: number;
    };
    avgVotesPerJustification: number;
    topJustification?: {
      content: string;
      voteSum: number;
      stance: string;
      topic: string;
    };
  };
  activityOverTime: ActivityOverTime[];
}
