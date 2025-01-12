import { toEther } from "thirdweb";
import { env } from "~/env";
import { encodeAbiParameters, keccak256 } from "viem";

interface User {
  id: string;
  tipsReceivedAllTime: number;
}

interface Tip {
  id: string;
  amount: string;
  time: string;
  tipperUserId: string;
  tippedUserId: string;
  teamId: string;
}

interface UsersResponse {
  items: User[];
}

interface TipsResponse {
  items: Tip[];
}

interface GraphQLResponse {
  data: {
    users: UsersResponse;
    tips?: TipsResponse;
  };
}

interface LeaderboardEntry {
  userAddress: string;
  totalAmount: number;
}

export const getAllTimeTippedCount = async ({
  address,
}: {
  address: string
}) => {
  const query = `
    query GetUser {
      users(
        where: { id: "${address}" }
        orderBy: "id"
        orderDirection: "desc"
      ) {
        items {
          id
          tipsReceivedAllTime
        }
      }
    }
  `;

  const response = await fetch(`${env.GHOST_API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Ghost-Api-Key': env.GHOST_API_KEY,
    },
    body: JSON.stringify({
      query,
    }),
  });

  const data = await response.json() as GraphQLResponse;
  return data.data.users.items[0]?.tipsReceivedAllTime ?? 0;
};

export const getTipsSentToday = async ({
  address,
}: {
  address: string
}) => {
  // Get the start of today in UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const startOfDay = Math.floor(today.getTime() / 1000);

  const query = `
    query GetTipsSentToday {
      tips(
        where: { 
          tipperUserId: "${address}",
          time_gte: "${startOfDay.toString()}"
        }
      ) {
        items {
          id
          amount
          time
        }
      }
    }
  `;

  try {
    const response = await fetch(`${env.GHOST_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ghost-Api-Key': env.GHOST_API_KEY,
      },
      body: JSON.stringify({
        query,
      }),
    });

    const data = await response.json() as GraphQLResponse;
    
    // Check for GraphQL errors
    if ('errors' in data) {
      console.error('GraphQL Errors:', data.errors);
      return 0;
    }

    // Check if we have valid tips data
    if (!data.data?.tips?.items) {
      return 0;
    }

    // Sum up all tips sent today
    const tipsSentToday = data.data.tips.items.reduce((sum, tip) => {
      return sum + BigInt(tip.amount);
    }, BigInt(0));

    // return as a string of ether
    return toEther(tipsSentToday);
  } catch (error) {
    console.error('Error fetching tips:', error);
    return 0;
  }
};

export const getTeamLeaderboard = async ({
  teamId,
  startTime,
}: {
  teamId: string;
  startTime: number;
}) => {
  const encryptedTeamId = keccak256(encodeAbiParameters([{ type: 'string' }], [teamId]));
  
  const query = `
    query GetTeamTips {
      tips(
        where: { 
          teamId: "${encryptedTeamId}",
          time_gte: "${startTime.toString()}"
        }
      ) {
        items {
          id
          amount
          time
          tippedUserId
        }
      }
    }
  `;

  try {
    const response = await fetch(`${env.GHOST_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ghost-Api-Key': env.GHOST_API_KEY,
      },
      body: JSON.stringify({
        query,
      }),
    });

    const json = await response.json() as GraphQLResponse;
    
    if ('errors' in json) {
      console.error('GraphQL Errors:', json.errors);
      return [];
    }

    if (!json.data?.tips?.items) {
      return [];
    }

    // Aggregate tips by recipient
    const recipientTotals = new Map<string, number>();
    
    json.data.tips.items.forEach(tip => {
      const currentTotal = recipientTotals.get(tip.tipperUserId) ?? 0;
      const amount = toEther(BigInt(tip.amount));
      recipientTotals.set(tip.tippedUserId, currentTotal + Number(amount));
    });

    // Convert to array and sort by total amount
    const leaderboard: LeaderboardEntry[] = Array.from(recipientTotals.entries())
      .map(([userAddress, totalAmount]) => ({
        userAddress,
        totalAmount,
      }))
      .sort((a, b) => {
        if (b.totalAmount === a.totalAmount) return 0;
        return b.totalAmount > a.totalAmount ? 1 : -1;
      });

    return leaderboard;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching team leaderboard:', error.message);
    } else {
      console.error('Error fetching team leaderboard:', error);
    }
    return [];
  }
};

export const getDailyLeaderboard = async (teamId: string) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const startOfDay = Math.floor(today.getTime() / 1000);
  
  return getTeamLeaderboard({
    teamId,
    startTime: startOfDay,
  });
};

export const getWeeklyLeaderboard = async (teamId: string) => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  // Set to beginning of current week (Sunday)
  now.setUTCDate(now.getUTCDate() - now.getUTCDay());
  const startOfWeek = Math.floor(now.getTime() / 1000);
  
  return getTeamLeaderboard({
    teamId,
    startTime: startOfWeek,
  });
};

export const getMonthlyLeaderboard = async (teamId: string) => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  now.setUTCDate(1); // Set to first day of current month
  const startOfMonth = Math.floor(now.getTime() / 1000);
  
  return getTeamLeaderboard({
    teamId,
    startTime: startOfMonth,
  });
};