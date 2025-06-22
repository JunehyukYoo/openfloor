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
  creatorId: string;
}

// SIDEBAR

export interface TopicDataMini {
  id: string;
  title: string;
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
