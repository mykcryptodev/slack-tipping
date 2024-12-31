import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
* Contract events
*/

/**
 * Represents the filters for the "Approval" event.
 */
export type ApprovalEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"owner","type":"address"}>
spender: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"spender","type":"address"}>
}>;

/**
 * Creates an event object for the Approval event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalEvent({
 *  owner: ...,
 *  spender: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalEvent(filters: ApprovalEventFilters = {}) {
  return prepareEvent({
    signature: "event Approval(address indexed owner, address indexed spender, uint256 value)",
    filters,
  });
};
  



/**
 * Creates an event object for the ContractURIUpdated event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { contractURIUpdatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractURIUpdatedEvent()
 * ],
 * });
 * ```
 */
export function contractURIUpdatedEvent() {
  return prepareEvent({
    signature: "event ContractURIUpdated(string prevURI, string newURI)",
  });
};
  

/**
 * Represents the filters for the "OwnerUpdated" event.
 */
export type OwnerUpdatedEventFilters = Partial<{
  prevOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"prevOwner","type":"address"}>
newOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}>
}>;

/**
 * Creates an event object for the OwnerUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ownerUpdatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownerUpdatedEvent({
 *  prevOwner: ...,
 *  newOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownerUpdatedEvent(filters: OwnerUpdatedEventFilters = {}) {
  return prepareEvent({
    signature: "event OwnerUpdated(address indexed prevOwner, address indexed newOwner)",
    filters,
  });
};
  

/**
 * Represents the filters for the "Registered" event.
 */
export type RegisteredEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"account","type":"address"}>
registeredBy: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"registeredBy","type":"address"}>
}>;

/**
 * Creates an event object for the Registered event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { registeredEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  registeredEvent({
 *  account: ...,
 *  registeredBy: ...,
 * })
 * ],
 * });
 * ```
 */
export function registeredEvent(filters: RegisteredEventFilters = {}) {
  return prepareEvent({
    signature: "event Registered(address indexed account, address indexed registeredBy)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RoleAdminChanged" event.
 */
export type RoleAdminChangedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
previousAdminRole: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"}>
newAdminRole: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}>
}>;

/**
 * Creates an event object for the RoleAdminChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleAdminChangedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleAdminChangedEvent({
 *  role: ...,
 *  previousAdminRole: ...,
 *  newAdminRole: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleAdminChangedEvent(filters: RoleAdminChangedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RoleGranted" event.
 */
export type RoleGrantedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"account","type":"address"}>
sender: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"sender","type":"address"}>
}>;

/**
 * Creates an event object for the RoleGranted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleGrantedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleGrantedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleGrantedEvent(filters: RoleGrantedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RoleRevoked" event.
 */
export type RoleRevokedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"account","type":"address"}>
sender: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"sender","type":"address"}>
}>;

/**
 * Creates an event object for the RoleRevoked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleRevokedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleRevokedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleRevokedEvent(filters: RoleRevokedEventFilters = {}) {
  return prepareEvent({
    signature: "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
};
  

/**
 * Represents the filters for the "Tipped" event.
 */
export type TippedEventFilters = Partial<{
  sender: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"sender","type":"address"}>
recipient: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"recipient","type":"address"}>
}>;

/**
 * Creates an event object for the Tipped event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tippedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tippedEvent({
 *  sender: ...,
 *  recipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function tippedEvent(filters: TippedEventFilters = {}) {
  return prepareEvent({
    signature: "event Tipped(address indexed sender, address indexed recipient, uint256 amount)",
    filters,
  });
};
  

/**
 * Represents the filters for the "TokensMinted" event.
 */
export type TokensMintedEventFilters = Partial<{
  mintedTo: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"mintedTo","type":"address"}>
}>;

/**
 * Creates an event object for the TokensMinted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensMintedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensMintedEvent({
 *  mintedTo: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensMintedEvent(filters: TokensMintedEventFilters = {}) {
  return prepareEvent({
    signature: "event TokensMinted(address indexed mintedTo, uint256 quantityMinted)",
    filters,
  });
};
  

/**
 * Represents the filters for the "Transfer" event.
 */
export type TransferEventFilters = Partial<{
  from: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"from","type":"address"}>
to: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"to","type":"address"}>
}>;

/**
 * Creates an event object for the Transfer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { transferEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferEvent({
 *  from: ...,
 *  to: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferEvent(filters: TransferEventFilters = {}) {
  return prepareEvent({
    signature: "event Transfer(address indexed from, address indexed to, uint256 value)",
    filters,
  });
};
  

/**
 * Represents the filters for the "Unregistered" event.
 */
export type UnregisteredEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"account","type":"address"}>
unregisteredBy: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"unregisteredBy","type":"address"}>
}>;

/**
 * Creates an event object for the Unregistered event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { unregisteredEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  unregisteredEvent({
 *  account: ...,
 *  unregisteredBy: ...,
 * })
 * ],
 * });
 * ```
 */
export function unregisteredEvent(filters: UnregisteredEventFilters = {}) {
  return prepareEvent({
    signature: "event Unregistered(address indexed account, address indexed unregisteredBy)",
    filters,
  });
};
  

/**
* Contract read functions
*/



/**
 * Calls the "DAILY_TIP_LIMIT" function on the contract.
 * @param options - The options for the DAILY_TIP_LIMIT function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { DAILY_TIP_LIMIT } from "TODO";
 *
 * const result = await DAILY_TIP_LIMIT();
 *
 * ```
 */
export async function DAILY_TIP_LIMIT(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xca09adf6",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "DEFAULT_ADMIN_ROLE" function on the contract.
 * @param options - The options for the DEFAULT_ADMIN_ROLE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { DEFAULT_ADMIN_ROLE } from "TODO";
 *
 * const result = await DEFAULT_ADMIN_ROLE();
 *
 * ```
 */
export async function DEFAULT_ADMIN_ROLE(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa217fddf",
  [],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "DOMAIN_SEPARATOR" function on the contract.
 * @param options - The options for the DOMAIN_SEPARATOR function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { DOMAIN_SEPARATOR } from "TODO";
 *
 * const result = await DOMAIN_SEPARATOR();
 *
 * ```
 */
export async function DOMAIN_SEPARATOR(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x3644e515",
  [],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "REGISTER_ROLE" function on the contract.
 * @param options - The options for the REGISTER_ROLE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { REGISTER_ROLE } from "TODO";
 *
 * const result = await REGISTER_ROLE();
 *
 * ```
 */
export async function REGISTER_ROLE(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x74f53317",
  [],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "RESET_PERIOD" function on the contract.
 * @param options - The options for the RESET_PERIOD function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { RESET_PERIOD } from "TODO";
 *
 * const result = await RESET_PERIOD();
 *
 * ```
 */
export async function RESET_PERIOD(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x3e46a5f3",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "TIP_ON_BEHALF_OF_ROLE" function on the contract.
 * @param options - The options for the TIP_ON_BEHALF_OF_ROLE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { TIP_ON_BEHALF_OF_ROLE } from "TODO";
 *
 * const result = await TIP_ON_BEHALF_OF_ROLE();
 *
 * ```
 */
export async function TIP_ON_BEHALF_OF_ROLE(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa0ca6a20",
  [],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "allowance" function.
 */
export type AllowanceParams = {
  owner: AbiParameterToPrimitiveType<{"internalType":"address","name":"owner","type":"address"}>
spender: AbiParameterToPrimitiveType<{"internalType":"address","name":"spender","type":"address"}>
};

/**
 * Calls the "allowance" function on the contract.
 * @param options - The options for the allowance function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { allowance } from "TODO";
 *
 * const result = await allowance({
 *  owner: ...,
 *  spender: ...,
 * });
 *
 * ```
 */
export async function allowance(
  options: BaseTransactionOptions<AllowanceParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xdd62ed3e",
  [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.owner, options.spender]
  });
};


/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { balanceOf } from "TODO";
 *
 * const result = await balanceOf({
 *  account: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x70a08231",
  [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.account]
  });
};




/**
 * Calls the "contractURI" function on the contract.
 * @param options - The options for the contractURI function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { contractURI } from "TODO";
 *
 * const result = await contractURI();
 *
 * ```
 */
export async function contractURI(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe8a3d485",
  [],
  [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "decimals" function on the contract.
 * @param options - The options for the decimals function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { decimals } from "TODO";
 *
 * const result = await decimals();
 *
 * ```
 */
export async function decimals(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x313ce567",
  [],
  [
    {
      "internalType": "uint8",
      "name": "",
      "type": "uint8"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "getRoleAdmin" function.
 */
export type GetRoleAdminParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
};

/**
 * Calls the "getRoleAdmin" function on the contract.
 * @param options - The options for the getRoleAdmin function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRoleAdmin } from "TODO";
 *
 * const result = await getRoleAdmin({
 *  role: ...,
 * });
 *
 * ```
 */
export async function getRoleAdmin(
  options: BaseTransactionOptions<GetRoleAdminParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x248a9ca3",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    }
  ],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: [options.role]
  });
};


/**
 * Represents the parameters for the "getRoleMember" function.
 */
export type GetRoleMemberParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
index: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"index","type":"uint256"}>
};

/**
 * Calls the "getRoleMember" function on the contract.
 * @param options - The options for the getRoleMember function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRoleMember } from "TODO";
 *
 * const result = await getRoleMember({
 *  role: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function getRoleMember(
  options: BaseTransactionOptions<GetRoleMemberParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x9010d07c",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "member",
      "type": "address"
    }
  ]
],
    params: [options.role, options.index]
  });
};


/**
 * Represents the parameters for the "getRoleMemberCount" function.
 */
export type GetRoleMemberCountParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
};

/**
 * Calls the "getRoleMemberCount" function on the contract.
 * @param options - The options for the getRoleMemberCount function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRoleMemberCount } from "TODO";
 *
 * const result = await getRoleMemberCount({
 *  role: ...,
 * });
 *
 * ```
 */
export async function getRoleMemberCount(
  options: BaseTransactionOptions<GetRoleMemberCountParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xca15c873",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "count",
      "type": "uint256"
    }
  ]
],
    params: [options.role]
  });
};


/**
 * Represents the parameters for the "hasRole" function.
 */
export type HasRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "hasRole" function on the contract.
 * @param options - The options for the hasRole function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { hasRole } from "TODO";
 *
 * const result = await hasRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasRole(
  options: BaseTransactionOptions<HasRoleParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x91d14854",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "hasRoleWithSwitch" function.
 */
export type HasRoleWithSwitchParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "hasRoleWithSwitch" function on the contract.
 * @param options - The options for the hasRoleWithSwitch function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { hasRoleWithSwitch } from "TODO";
 *
 * const result = await hasRoleWithSwitch({
 *  role: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasRoleWithSwitch(
  options: BaseTransactionOptions<HasRoleWithSwitchParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa32fa5b3",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "isRegistered" function.
 */
export type IsRegisteredParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
};

/**
 * Calls the "isRegistered" function on the contract.
 * @param options - The options for the isRegistered function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isRegistered } from "TODO";
 *
 * const result = await isRegistered({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function isRegistered(
  options: BaseTransactionOptions<IsRegisteredParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xc3c5a547",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.arg_0]
  });
};


/**
 * Represents the parameters for the "lastTipReset" function.
 */
export type LastTipResetParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
};

/**
 * Calls the "lastTipReset" function on the contract.
 * @param options - The options for the lastTipReset function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { lastTipReset } from "TODO";
 *
 * const result = await lastTipReset({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function lastTipReset(
  options: BaseTransactionOptions<LastTipResetParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xcbff9a5d",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.arg_0]
  });
};




/**
 * Calls the "name" function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { name } from "TODO";
 *
 * const result = await name();
 *
 * ```
 */
export async function name(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x06fdde03",
  [],
  [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "nonces" function.
 */
export type NoncesParams = {
  owner: AbiParameterToPrimitiveType<{"internalType":"address","name":"owner","type":"address"}>
};

/**
 * Calls the "nonces" function on the contract.
 * @param options - The options for the nonces function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { nonces } from "TODO";
 *
 * const result = await nonces({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function nonces(
  options: BaseTransactionOptions<NoncesParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x7ecebe00",
  [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.owner]
  });
};




/**
 * Calls the "owner" function on the contract.
 * @param options - The options for the owner function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { owner } from "TODO";
 *
 * const result = await owner();
 *
 * ```
 */
export async function owner(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x8da5cb5b",
  [],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "symbol" function on the contract.
 * @param options - The options for the symbol function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { symbol } from "TODO";
 *
 * const result = await symbol();
 *
 * ```
 */
export async function symbol(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x95d89b41",
  [],
  [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "tipsSentToday" function.
 */
export type TipsSentTodayParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
};

/**
 * Calls the "tipsSentToday" function on the contract.
 * @param options - The options for the tipsSentToday function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { tipsSentToday } from "TODO";
 *
 * const result = await tipsSentToday({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function tipsSentToday(
  options: BaseTransactionOptions<TipsSentTodayParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xf9c1ec41",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.arg_0]
  });
};




/**
 * Calls the "totalSupply" function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { totalSupply } from "TODO";
 *
 * const result = await totalSupply();
 *
 * ```
 */
export async function totalSupply(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x18160ddd",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};


/**
* Contract write functions
*/

/**
 * Represents the parameters for the "approve" function.
 */
export type ApproveParams = {
  spender: AbiParameterToPrimitiveType<{"internalType":"address","name":"spender","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"amount","type":"uint256"}>
};

/**
 * Calls the "approve" function on the contract.
 * @param options - The options for the "approve" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { approve } from "TODO";
 *
 * const transaction = approve({
 *  spender: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approve(
  options: BaseTransactionOptions<ApproveParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x095ea7b3",
  [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.spender, options.amount]
  });
};


/**
 * Represents the parameters for the "burn" function.
 */
export type BurnParams = {
  amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_amount","type":"uint256"}>
};

/**
 * Calls the "burn" function on the contract.
 * @param options - The options for the "burn" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { burn } from "TODO";
 *
 * const transaction = burn({
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burn(
  options: BaseTransactionOptions<BurnParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x42966c68",
  [
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.amount]
  });
};


/**
 * Represents the parameters for the "burnFrom" function.
 */
export type BurnFromParams = {
  account: AbiParameterToPrimitiveType<{"internalType":"address","name":"_account","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_amount","type":"uint256"}>
};

/**
 * Calls the "burnFrom" function on the contract.
 * @param options - The options for the "burnFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { burnFrom } from "TODO";
 *
 * const transaction = burnFrom({
 *  account: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burnFrom(
  options: BaseTransactionOptions<BurnFromParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x79cc6790",
  [
    {
      "internalType": "address",
      "name": "_account",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.account, options.amount]
  });
};


/**
 * Represents the parameters for the "decreaseAllowance" function.
 */
export type DecreaseAllowanceParams = {
  spender: AbiParameterToPrimitiveType<{"internalType":"address","name":"spender","type":"address"}>
subtractedValue: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"subtractedValue","type":"uint256"}>
};

/**
 * Calls the "decreaseAllowance" function on the contract.
 * @param options - The options for the "decreaseAllowance" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { decreaseAllowance } from "TODO";
 *
 * const transaction = decreaseAllowance({
 *  spender: ...,
 *  subtractedValue: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function decreaseAllowance(
  options: BaseTransactionOptions<DecreaseAllowanceParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xa457c2d7",
  [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "subtractedValue",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.spender, options.subtractedValue]
  });
};


/**
 * Represents the parameters for the "grantRole" function.
 */
export type GrantRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "grantRole" function on the contract.
 * @param options - The options for the "grantRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { grantRole } from "TODO";
 *
 * const transaction = grantRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function grantRole(
  options: BaseTransactionOptions<GrantRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x2f2ff15d",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "increaseAllowance" function.
 */
export type IncreaseAllowanceParams = {
  spender: AbiParameterToPrimitiveType<{"internalType":"address","name":"spender","type":"address"}>
addedValue: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"addedValue","type":"uint256"}>
};

/**
 * Calls the "increaseAllowance" function on the contract.
 * @param options - The options for the "increaseAllowance" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { increaseAllowance } from "TODO";
 *
 * const transaction = increaseAllowance({
 *  spender: ...,
 *  addedValue: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function increaseAllowance(
  options: BaseTransactionOptions<IncreaseAllowanceParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x39509351",
  [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "addedValue",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.spender, options.addedValue]
  });
};


/**
 * Represents the parameters for the "mintTo" function.
 */
export type MintToParams = {
  to: AbiParameterToPrimitiveType<{"internalType":"address","name":"_to","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_amount","type":"uint256"}>
};

/**
 * Calls the "mintTo" function on the contract.
 * @param options - The options for the "mintTo" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { mintTo } from "TODO";
 *
 * const transaction = mintTo({
 *  to: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintTo(
  options: BaseTransactionOptions<MintToParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x449a52f8",
  [
    {
      "internalType": "address",
      "name": "_to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "_amount",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.to, options.amount]
  });
};


/**
 * Represents the parameters for the "multicall" function.
 */
export type MulticallParams = {
  data: AbiParameterToPrimitiveType<{"internalType":"bytes[]","name":"data","type":"bytes[]"}>
};

/**
 * Calls the "multicall" function on the contract.
 * @param options - The options for the "multicall" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { multicall } from "TODO";
 *
 * const transaction = multicall({
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function multicall(
  options: BaseTransactionOptions<MulticallParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xac9650d8",
  [
    {
      "internalType": "bytes[]",
      "name": "data",
      "type": "bytes[]"
    }
  ],
  [
    {
      "internalType": "bytes[]",
      "name": "results",
      "type": "bytes[]"
    }
  ]
],
    params: [options.data]
  });
};


/**
 * Represents the parameters for the "permit" function.
 */
export type PermitParams = {
  owner: AbiParameterToPrimitiveType<{"internalType":"address","name":"owner","type":"address"}>
spender: AbiParameterToPrimitiveType<{"internalType":"address","name":"spender","type":"address"}>
value: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"value","type":"uint256"}>
deadline: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"deadline","type":"uint256"}>
v: AbiParameterToPrimitiveType<{"internalType":"uint8","name":"v","type":"uint8"}>
r: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"r","type":"bytes32"}>
s: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"s","type":"bytes32"}>
};

/**
 * Calls the "permit" function on the contract.
 * @param options - The options for the "permit" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { permit } from "TODO";
 *
 * const transaction = permit({
 *  owner: ...,
 *  spender: ...,
 *  value: ...,
 *  deadline: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function permit(
  options: BaseTransactionOptions<PermitParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xd505accf",
  [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "deadline",
      "type": "uint256"
    },
    {
      "internalType": "uint8",
      "name": "v",
      "type": "uint8"
    },
    {
      "internalType": "bytes32",
      "name": "r",
      "type": "bytes32"
    },
    {
      "internalType": "bytes32",
      "name": "s",
      "type": "bytes32"
    }
  ],
  []
],
    params: [options.owner, options.spender, options.value, options.deadline, options.v, options.r, options.s]
  });
};


/**
 * Represents the parameters for the "registerAccount" function.
 */
export type RegisterAccountParams = {
  account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "registerAccount" function on the contract.
 * @param options - The options for the "registerAccount" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { registerAccount } from "TODO";
 *
 * const transaction = registerAccount({
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function registerAccount(
  options: BaseTransactionOptions<RegisterAccountParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x97c414df",
  [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.account]
  });
};


/**
 * Represents the parameters for the "renounceRole" function.
 */
export type RenounceRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "renounceRole" function on the contract.
 * @param options - The options for the "renounceRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { renounceRole } from "TODO";
 *
 * const transaction = renounceRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function renounceRole(
  options: BaseTransactionOptions<RenounceRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x36568abe",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "revokeRole" function.
 */
export type RevokeRoleParams = {
  role: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"role","type":"bytes32"}>
account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "revokeRole" function on the contract.
 * @param options - The options for the "revokeRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { revokeRole } from "TODO";
 *
 * const transaction = revokeRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function revokeRole(
  options: BaseTransactionOptions<RevokeRoleParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xd547741f",
  [
    {
      "internalType": "bytes32",
      "name": "role",
      "type": "bytes32"
    },
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.role, options.account]
  });
};


/**
 * Represents the parameters for the "setContractURI" function.
 */
export type SetContractURIParams = {
  uri: AbiParameterToPrimitiveType<{"internalType":"string","name":"_uri","type":"string"}>
};

/**
 * Calls the "setContractURI" function on the contract.
 * @param options - The options for the "setContractURI" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setContractURI } from "TODO";
 *
 * const transaction = setContractURI({
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setContractURI(
  options: BaseTransactionOptions<SetContractURIParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x938e3d7b",
  [
    {
      "internalType": "string",
      "name": "_uri",
      "type": "string"
    }
  ],
  []
],
    params: [options.uri]
  });
};


/**
 * Represents the parameters for the "setOwner" function.
 */
export type SetOwnerParams = {
  newOwner: AbiParameterToPrimitiveType<{"internalType":"address","name":"_newOwner","type":"address"}>
};

/**
 * Calls the "setOwner" function on the contract.
 * @param options - The options for the "setOwner" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setOwner } from "TODO";
 *
 * const transaction = setOwner({
 *  newOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setOwner(
  options: BaseTransactionOptions<SetOwnerParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x13af4035",
  [
    {
      "internalType": "address",
      "name": "_newOwner",
      "type": "address"
    }
  ],
  []
],
    params: [options.newOwner]
  });
};


/**
 * Represents the parameters for the "tip" function.
 */
export type TipParams = {
  to: AbiParameterToPrimitiveType<{"internalType":"address","name":"to","type":"address"}>
from: AbiParameterToPrimitiveType<{"internalType":"address","name":"from","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"amount","type":"uint256"}>
};

/**
 * Calls the "tip" function on the contract.
 * @param options - The options for the "tip" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { tip } from "TODO";
 *
 * const transaction = tip({
 *  to: ...,
 *  from: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function tip(
  options: BaseTransactionOptions<TipParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xd82555f1",
  [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.to, options.from, options.amount]
  });
};


/**
 * Represents the parameters for the "tipMany" function.
 */
export type TipManyParams = {
  to: AbiParameterToPrimitiveType<{"internalType":"address[]","name":"to","type":"address[]"}>
from: AbiParameterToPrimitiveType<{"internalType":"address","name":"from","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"amount","type":"uint256"}>
};

/**
 * Calls the "tipMany" function on the contract.
 * @param options - The options for the "tipMany" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { tipMany } from "TODO";
 *
 * const transaction = tipMany({
 *  to: ...,
 *  from: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function tipMany(
  options: BaseTransactionOptions<TipManyParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x3d7f302d",
  [
    {
      "internalType": "address[]",
      "name": "to",
      "type": "address[]"
    },
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.to, options.from, options.amount]
  });
};


/**
 * Represents the parameters for the "transfer" function.
 */
export type TransferParams = {
  to: AbiParameterToPrimitiveType<{"internalType":"address","name":"to","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"amount","type":"uint256"}>
};

/**
 * Calls the "transfer" function on the contract.
 * @param options - The options for the "transfer" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transfer } from "TODO";
 *
 * const transaction = transfer({
 *  to: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transfer(
  options: BaseTransactionOptions<TransferParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xa9059cbb",
  [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.to, options.amount]
  });
};


/**
 * Represents the parameters for the "transferFrom" function.
 */
export type TransferFromParams = {
  from: AbiParameterToPrimitiveType<{"internalType":"address","name":"from","type":"address"}>
to: AbiParameterToPrimitiveType<{"internalType":"address","name":"to","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"amount","type":"uint256"}>
};

/**
 * Calls the "transferFrom" function on the contract.
 * @param options - The options for the "transferFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transferFrom } from "TODO";
 *
 * const transaction = transferFrom({
 *  from: ...,
 *  to: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferFrom(
  options: BaseTransactionOptions<TransferFromParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x23b872dd",
  [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.from, options.to, options.amount]
  });
};


/**
 * Represents the parameters for the "unregisterAccount" function.
 */
export type UnregisterAccountParams = {
  account: AbiParameterToPrimitiveType<{"internalType":"address","name":"account","type":"address"}>
};

/**
 * Calls the "unregisterAccount" function on the contract.
 * @param options - The options for the "unregisterAccount" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { unregisterAccount } from "TODO";
 *
 * const transaction = unregisterAccount({
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function unregisterAccount(
  options: BaseTransactionOptions<UnregisterAccountParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xafabeb2e",
  [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  []
],
    params: [options.account]
  });
};


