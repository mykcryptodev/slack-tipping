export type SlackInteractivityPayload = {
  type: string;
  user: {
    id: string;
    username: string;
    name: string;
    team_id: string;
  };
  api_app_id: string;
  token: string;
  container: {
    type: string;
    message_ts: string;
    channel_id: string;
    is_ephemeral: boolean;
  };
  trigger_id: string;
  team: {
    id: string;
    domain: string;
  };
  enterprise: null;
  is_enterprise_install: boolean;
  channel: {
    id: string;
    name: string;
  };
  message: {
    user: string;
    type: string;
    ts: string;
    bot_id: string;
    app_id: string;
    text: string;
    team: string;
    blocks: Array<{
      type: string;
      block_id: string;
      text?: {
        type: string;
        text: string;
        verbatim: boolean;
      };
      elements?: Array<{
        type: string;
        image_url?: string;
        alt_text?: string;
        text?: string;
        action_id?: string;
        url?: string;
        verbatim?: boolean;
      }>;
    }>;
  };
  state: {
    values: Record<string, unknown>;
  };
  response_url: string;
  actions: Array<{
    action_id: string;
    block_id: string;
    text: {
      type: string;
      text: string;
      emoji: boolean;
    };
    type: string;
    action_ts: string;
  }>;
};