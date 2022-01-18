"use strict";
export async function handle(state, action) {
  console.log(SmartWeave.transaction.tags);
  const _function = action.input.function;
  const caller = action.caller;
  switch (_function) {
    case "register": {
      state.users.push(caller); 
      break;
    }
    default: {
      throw new ContractError(`Invalid function: "${_function}"`);
    }
  }
  return { state };
}