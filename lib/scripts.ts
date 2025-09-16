export const noAuthCode = `use.miden::account
use.std::word

#! Increment the nonce only if the account commitment has changed
#!
#! This authentication procedure provides minimal authentication by checking if the account
#! state has actually changed during transaction execution. It compares the initial account
#! commitment with the current commitment and only increments the nonce if they differ.
#! This avoids unnecessary nonce increments for transactions that don't modify
#! the account state.
#!
#! Inputs:  [pad(16)]
#! Outputs: [pad(16)]
export.auth__no_auth
    # check if the account state has changed by comparing initial and final commitments

    exec.account::get_initial_commitment
    # => [INITIAL_COMMITMENT, pad(16)]

    exec.account::compute_current_commitment
    # => [CURRENT_COMMITMENT, INITIAL_COMMITMENT, pad(16)]

    exec.word::eq not
    # => [has_account_state_changed, pad(16)]

    # if the account has been updated, increment the nonce
    if.true
        exec.account::incr_nonce drop
    end
end
`;

export const counterContractCode = `use.miden::account
use.std::sys

# => []
export.get_count
    push.0.0.0.1
    # => [key]
    push.0
    # => [index, key]
    exec.account::get_map_item
    # => [count]
end

# => []
export.increment_count
    push.0.0.0.1
    # => [key]
    push.0
    # => [index, key]
    exec.account::get_map_item
    # => [count]
    add.1
    # => [count+1]
    push.0.0.0.1
    # => [key, count+1]
    push.0
    # => [index, key, count+1]
    exec.account::set_map_item
    # => [OLD_MAP_ROOT, OLD_MAP_VALUE]
    exec.sys::truncate_stack
    # => []
end
`;

export const txScriptCode = `use.external_contract::counter_contract
begin
    call.counter_contract::increment_count
end
`;
