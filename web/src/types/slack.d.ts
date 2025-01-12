export interface SlackInteractivityPayload {
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
    view_id: string;
  };
  trigger_id: string;
  team: {
    id: string;
    domain: string;
  };
  enterprise: null;
  is_enterprise_install: boolean;
  view?: {
    id: string;
    team_id: string;
    type: string;
    state: {
      values: {
        withdrawal_address: {
          withdrawal_address_input: {
            type: string;
            value: string;
          };
        };
        withdrawal_amount: {
          withdrawal_amount_input: {
            type: string;
            value: string;
          };
        };
      };
    };
  };
  actions?: Array<{
    action_id: string;
    block_id: string;
    text?: {
      type: string;
      text: string;
      emoji?: boolean;
    };
    type: string;
    action_ts: string;
    selected_option?: {
      text: {
        type: string;
        text: string;
        emoji?: boolean;
      };
      value: string;
    };
  }>;
}