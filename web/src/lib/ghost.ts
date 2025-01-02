import { toEther } from "thirdweb";
import { env } from "~/env";

interface User {
  id: string;
  tipsReceivedAllTime: number;
}

interface Tip {
  id: string;
  amount: string;
  time: string;
  tipperUserId: string;
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