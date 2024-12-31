import { env } from "~/env";

interface User {
  id: string;
  tipsReceivedAllTime: number;
}

interface UsersResponse {
  items: User[];
}

interface GraphQLResponse {
  data: {
    users: UsersResponse;
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