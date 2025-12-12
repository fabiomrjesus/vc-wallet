{

    function allocate_unbounded() -> memPtr {
        memPtr := mload(64)
    }

    function revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() {
        revert(0, 0)
    }

    function revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() {
        revert(0, 0)
    }

    function cleanup_t_uint160(value) -> cleaned {
        cleaned := and(value, 0xffffffffffffffffffffffffffffffffffffffff)
    }

    function cleanup_t_address(value) -> cleaned {
        cleaned := cleanup_t_uint160(value)
    }

    function validator_revert_t_address(value) {
        if iszero(eq(value, cleanup_t_address(value))) { revert(0, 0) }
    }

    function abi_decode_t_address(offset, end) -> value {
        value := calldataload(offset)
        validator_revert_t_address(value)
    }

    function abi_decode_tuple_t_address(headStart, dataEnd) -> value0 {
        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_address(add(headStart, offset), dataEnd)
        }

    }

    function cleanup_t_uint256(value) -> cleaned {
        cleaned := value
    }

    function abi_encode_t_uint256_to_t_uint256_fromStack(value, pos) {
        mstore(pos, cleanup_t_uint256(value))
    }

    function abi_encode_tuple_t_uint256__to_t_uint256__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_uint256_to_t_uint256_fromStack(value0,  add(headStart, 0))

    }

    function cleanup_t_bytes32(value) -> cleaned {
        cleaned := value
    }

    function validator_revert_t_bytes32(value) {
        if iszero(eq(value, cleanup_t_bytes32(value))) { revert(0, 0) }
    }

    function abi_decode_t_bytes32(offset, end) -> value {
        value := calldataload(offset)
        validator_revert_t_bytes32(value)
    }

    function cleanup_t_bool(value) -> cleaned {
        cleaned := iszero(iszero(value))
    }

    function validator_revert_t_bool(value) {
        if iszero(eq(value, cleanup_t_bool(value))) { revert(0, 0) }
    }

    function abi_decode_t_bool(offset, end) -> value {
        value := calldataload(offset)
        validator_revert_t_bool(value)
    }

    function abi_decode_tuple_t_addresst_bytes32t_addresst_bool(headStart, dataEnd) -> value0, value1, value2, value3 {
        if slt(sub(dataEnd, headStart), 128) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_address(add(headStart, offset), dataEnd)
        }

        {

            let offset := 32

            value1 := abi_decode_t_bytes32(add(headStart, offset), dataEnd)
        }

        {

            let offset := 64

            value2 := abi_decode_t_address(add(headStart, offset), dataEnd)
        }

        {

            let offset := 96

            value3 := abi_decode_t_bool(add(headStart, offset), dataEnd)
        }

    }

    function abi_encode_t_bytes32_to_t_bytes32_fromStack(value, pos) {
        mstore(pos, cleanup_t_bytes32(value))
    }

    function abi_encode_tuple_t_bytes32__to_t_bytes32__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value0,  add(headStart, 0))

    }

    function abi_decode_tuple_t_bytes32(headStart, dataEnd) -> value0 {
        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_bytes32(add(headStart, offset), dataEnd)
        }

    }

    function panic_error_0x21() {
        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)
        mstore(4, 0x21)
        revert(0, 0x24)
    }

    function validator_assert_t_enum$_GlobalActionType_$295(value) {
        if iszero(lt(value, 4)) { panic_error_0x21() }
    }

    function cleanup_t_enum$_GlobalActionType_$295(value) -> cleaned {
        cleaned := value validator_assert_t_enum$_GlobalActionType_$295(value)
    }

    function convert_t_enum$_GlobalActionType_$295_to_t_uint8(value) -> converted {
        converted := cleanup_t_enum$_GlobalActionType_$295(value)
    }

    function abi_encode_t_enum$_GlobalActionType_$295_to_t_uint8_fromStack(value, pos) {
        mstore(pos, convert_t_enum$_GlobalActionType_$295_to_t_uint8(value))
    }

    function array_length_t_bytes_memory_ptr(value) -> length {

        length := mload(value)

    }

    function array_storeLengthForEncoding_t_bytes_memory_ptr_fromStack(pos, length) -> updated_pos {
        mstore(pos, length)
        updated_pos := add(pos, 0x20)
    }

    function copy_memory_to_memory_with_cleanup(src, dst, length) {

        mcopy(dst, src, length)
        mstore(add(dst, length), 0)

    }

    function round_up_to_mul_of_32(value) -> result {
        result := and(add(value, 31), not(31))
    }

    function abi_encode_t_bytes_memory_ptr_to_t_bytes_memory_ptr_fromStack(value, pos) -> end {
        let length := array_length_t_bytes_memory_ptr(value)
        pos := array_storeLengthForEncoding_t_bytes_memory_ptr_fromStack(pos, length)
        copy_memory_to_memory_with_cleanup(add(value, 0x20), pos, length)
        end := add(pos, round_up_to_mul_of_32(length))
    }

    function abi_encode_t_address_to_t_address_fromStack(value, pos) {
        mstore(pos, cleanup_t_address(value))
    }

    function cleanup_t_uint64(value) -> cleaned {
        cleaned := and(value, 0xffffffffffffffff)
    }

    function abi_encode_t_uint64_to_t_uint64_fromStack(value, pos) {
        mstore(pos, cleanup_t_uint64(value))
    }

    function abi_encode_t_bool_to_t_bool_fromStack(value, pos) {
        mstore(pos, cleanup_t_bool(value))
    }

    function abi_encode_tuple_t_enum$_GlobalActionType_$295_t_bytes_memory_ptr_t_address_t_uint64_t_uint64_t_bool__to_t_uint8_t_bytes_memory_ptr_t_address_t_uint64_t_uint64_t_bool__fromStack_reversed(headStart , value5, value4, value3, value2, value1, value0) -> tail {
        tail := add(headStart, 192)

        abi_encode_t_enum$_GlobalActionType_$295_to_t_uint8_fromStack(value0,  add(headStart, 0))

        mstore(add(headStart, 32), sub(tail, headStart))
        tail := abi_encode_t_bytes_memory_ptr_to_t_bytes_memory_ptr_fromStack(value1,  tail)

        abi_encode_t_address_to_t_address_fromStack(value2,  add(headStart, 64))

        abi_encode_t_uint64_to_t_uint64_fromStack(value3,  add(headStart, 96))

        abi_encode_t_uint64_to_t_uint64_fromStack(value4,  add(headStart, 128))

        abi_encode_t_bool_to_t_bool_fromStack(value5,  add(headStart, 160))

    }

    function abi_encode_tuple_t_bool__to_t_bool__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_bool_to_t_bool_fromStack(value0,  add(headStart, 0))

    }

    function revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d() {
        revert(0, 0)
    }

    function revert_error_15abf5612cd996bc235ba1e55a4a30ac60e6bb601ff7ba4ad3f179b6be8d0490() {
        revert(0, 0)
    }

    function revert_error_81385d8c0b31fffe14be1da910c8bd3a80be4cfa248e04f42ec0faea3132a8ef() {
        revert(0, 0)
    }

    // bytes[]
    function abi_decode_t_array$_t_bytes_calldata_ptr_$dyn_calldata_ptr(offset, end) -> arrayPos, length {
        if iszero(slt(add(offset, 0x1f), end)) { revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d() }
        length := calldataload(offset)
        if gt(length, 0xffffffffffffffff) { revert_error_15abf5612cd996bc235ba1e55a4a30ac60e6bb601ff7ba4ad3f179b6be8d0490() }
        arrayPos := add(offset, 0x20)
        if gt(add(arrayPos, mul(length, 0x20)), end) { revert_error_81385d8c0b31fffe14be1da910c8bd3a80be4cfa248e04f42ec0faea3132a8ef() }
    }

    function abi_decode_tuple_t_bytes32t_array$_t_bytes_calldata_ptr_$dyn_calldata_ptr(headStart, dataEnd) -> value0, value1, value2 {
        if slt(sub(dataEnd, headStart), 64) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_bytes32(add(headStart, offset), dataEnd)
        }

        {

            let offset := calldataload(add(headStart, 32))
            if gt(offset, 0xffffffffffffffff) { revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() }

            value1, value2 := abi_decode_t_array$_t_bytes_calldata_ptr_$dyn_calldata_ptr(add(headStart, offset), dataEnd)
        }

    }

    function abi_encode_tuple_t_address__to_t_address__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_address_to_t_address_fromStack(value0,  add(headStart, 0))

    }

    function validator_revert_t_uint256(value) {
        if iszero(eq(value, cleanup_t_uint256(value))) { revert(0, 0) }
    }

    function abi_decode_t_uint256(offset, end) -> value {
        value := calldataload(offset)
        validator_revert_t_uint256(value)
    }

    function abi_decode_tuple_t_uint256(headStart, dataEnd) -> value0 {
        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_uint256(add(headStart, offset), dataEnd)
        }

    }

    function array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, length) -> updated_pos {
        mstore(pos, length)
        updated_pos := add(pos, 0x20)
    }

    function store_literal_in_memory_40cd5b50775af0837ae8616ba559c320b992c1a222f65a189a28248dcd14595d(memPtr) {

        mstore(add(memPtr, 0), "Zero contract")

    }

    function abi_encode_t_stringliteral_40cd5b50775af0837ae8616ba559c320b992c1a222f65a189a28248dcd14595d_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 13)
        store_literal_in_memory_40cd5b50775af0837ae8616ba559c320b992c1a222f65a189a28248dcd14595d(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_40cd5b50775af0837ae8616ba559c320b992c1a222f65a189a28248dcd14595d__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_40cd5b50775af0837ae8616ba559c320b992c1a222f65a189a28248dcd14595d_to_t_string_memory_ptr_fromStack( tail)

    }

    function abi_encode_tuple_t_address_t_bytes32_t_address_t_bool__to_t_address_t_bytes32_t_address_t_bool__fromStack_reversed(headStart , value3, value2, value1, value0) -> tail {
        tail := add(headStart, 128)

        abi_encode_t_address_to_t_address_fromStack(value0,  add(headStart, 0))

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value1,  add(headStart, 32))

        abi_encode_t_address_to_t_address_fromStack(value2,  add(headStart, 64))

        abi_encode_t_bool_to_t_bool_fromStack(value3,  add(headStart, 96))

    }

    function panic_error_0x41() {
        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)
        mstore(4, 0x41)
        revert(0, 0x24)
    }

    function panic_error_0x22() {
        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)
        mstore(4, 0x22)
        revert(0, 0x24)
    }

    function extract_byte_array_length(data) -> length {
        length := div(data, 2)
        let outOfPlaceEncoding := and(data, 1)
        if iszero(outOfPlaceEncoding) {
            length := and(length, 0x7f)
        }

        if eq(outOfPlaceEncoding, lt(length, 32)) {
            panic_error_0x22()
        }
    }

    function array_dataslot_t_bytes_storage(ptr) -> data {
        data := ptr

        mstore(0, ptr)
        data := keccak256(0, 0x20)

    }

    function divide_by_32_ceil(value) -> result {
        result := div(add(value, 31), 32)
    }

    function shift_left_dynamic(bits, value) -> newValue {
        newValue :=

        shl(bits, value)

    }

    function update_byte_slice_dynamic32(value, shiftBytes, toInsert) -> result {
        let shiftBits := mul(shiftBytes, 8)
        let mask := shift_left_dynamic(shiftBits, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
        toInsert := shift_left_dynamic(shiftBits, toInsert)
        value := and(value, not(mask))
        result := or(value, and(toInsert, mask))
    }

    function identity(value) -> ret {
        ret := value
    }

    function convert_t_uint256_to_t_uint256(value) -> converted {
        converted := cleanup_t_uint256(identity(cleanup_t_uint256(value)))
    }

    function prepare_store_t_uint256(value) -> ret {
        ret := value
    }

    function update_storage_value_t_uint256_to_t_uint256(slot, offset, value_0) {
        let convertedValue_0 := convert_t_uint256_to_t_uint256(value_0)
        sstore(slot, update_byte_slice_dynamic32(sload(slot), offset, prepare_store_t_uint256(convertedValue_0)))
    }

    function zero_value_for_split_t_uint256() -> ret {
        ret := 0
    }

    function storage_set_to_zero_t_uint256(slot, offset) {
        let zero_0 := zero_value_for_split_t_uint256()
        update_storage_value_t_uint256_to_t_uint256(slot, offset, zero_0)
    }

    function clear_storage_range_t_bytes1(start, end) {
        for {} lt(start, end) { start := add(start, 1) }
        {
            storage_set_to_zero_t_uint256(start, 0)
        }
    }

    function clean_up_bytearray_end_slots_t_bytes_storage(array, len, startIndex) {

        if gt(len, 31) {
            let dataArea := array_dataslot_t_bytes_storage(array)
            let deleteStart := add(dataArea, divide_by_32_ceil(startIndex))
            // If we are clearing array to be short byte array, we want to clear only data starting from array data area.
            if lt(startIndex, 32) { deleteStart := dataArea }
            clear_storage_range_t_bytes1(deleteStart, add(dataArea, divide_by_32_ceil(len)))
        }

    }

    function shift_right_unsigned_dynamic(bits, value) -> newValue {
        newValue :=

        shr(bits, value)

    }

    function mask_bytes_dynamic(data, bytes) -> result {
        let mask := not(shift_right_unsigned_dynamic(mul(8, bytes), not(0)))
        result := and(data, mask)
    }
    function extract_used_part_and_set_length_of_short_byte_array(data, len) -> used {
        // we want to save only elements that are part of the array after resizing
        // others should be set to zero
        data := mask_bytes_dynamic(data, len)
        used := or(data, mul(2, len))
    }
    function copy_byte_array_to_storage_from_t_bytes_memory_ptr_to_t_bytes_storage(slot, src) {

        let newLen := array_length_t_bytes_memory_ptr(src)
        // Make sure array length is sane
        if gt(newLen, 0xffffffffffffffff) { panic_error_0x41() }

        let oldLen := extract_byte_array_length(sload(slot))

        // potentially truncate data
        clean_up_bytearray_end_slots_t_bytes_storage(slot, oldLen, newLen)

        let srcOffset := 0

        srcOffset := 0x20

        switch gt(newLen, 31)
        case 1 {
            let loopEnd := and(newLen, not(0x1f))

            let dstPtr := array_dataslot_t_bytes_storage(slot)
            let i := 0
            for { } lt(i, loopEnd) { i := add(i, 0x20) } {
                sstore(dstPtr, mload(add(src, srcOffset)))
                dstPtr := add(dstPtr, 1)
                srcOffset := add(srcOffset, 32)
            }
            if lt(loopEnd, newLen) {
                let lastValue := mload(add(src, srcOffset))
                sstore(dstPtr, mask_bytes_dynamic(lastValue, and(newLen, 0x1f)))
            }
            sstore(slot, add(mul(newLen, 2), 1))
        }
        default {
            let value := 0
            if newLen {
                value := mload(add(src, srcOffset))
            }
            sstore(slot, extract_used_part_and_set_length_of_short_byte_array(value, newLen))
        }
    }

    function abi_encode_tuple_t_enum$_GlobalActionType_$295__to_t_uint8__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_enum$_GlobalActionType_$295_to_t_uint8_fromStack(value0,  add(headStart, 0))

    }

    function store_literal_in_memory_2daf4b76a8bbfbe60f0c99e909edfcad1ad50a386ad16db868579931440582d7(memPtr) {

        mstore(add(memPtr, 0), "Zero candidate")

    }

    function abi_encode_t_stringliteral_2daf4b76a8bbfbe60f0c99e909edfcad1ad50a386ad16db868579931440582d7_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 14)
        store_literal_in_memory_2daf4b76a8bbfbe60f0c99e909edfcad1ad50a386ad16db868579931440582d7(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_2daf4b76a8bbfbe60f0c99e909edfcad1ad50a386ad16db868579931440582d7__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_2daf4b76a8bbfbe60f0c99e909edfcad1ad50a386ad16db868579931440582d7_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_6950cd21054cbc0b0f5183772a70224c886e8d2b5a57fc1d5351fb20814991a7(memPtr) {

        mstore(add(memPtr, 0), "Already signer")

    }

    function abi_encode_t_stringliteral_6950cd21054cbc0b0f5183772a70224c886e8d2b5a57fc1d5351fb20814991a7_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 14)
        store_literal_in_memory_6950cd21054cbc0b0f5183772a70224c886e8d2b5a57fc1d5351fb20814991a7(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_6950cd21054cbc0b0f5183772a70224c886e8d2b5a57fc1d5351fb20814991a7__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_6950cd21054cbc0b0f5183772a70224c886e8d2b5a57fc1d5351fb20814991a7_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_535d7636857fb1ab3a4f159f2a66b9583ce224510b4368fa2453e15bee0bc833(memPtr) {

        mstore(add(memPtr, 0), "Zero address")

    }

    function abi_encode_t_stringliteral_535d7636857fb1ab3a4f159f2a66b9583ce224510b4368fa2453e15bee0bc833_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 12)
        store_literal_in_memory_535d7636857fb1ab3a4f159f2a66b9583ce224510b4368fa2453e15bee0bc833(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_535d7636857fb1ab3a4f159f2a66b9583ce224510b4368fa2453e15bee0bc833__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_535d7636857fb1ab3a4f159f2a66b9583ce224510b4368fa2453e15bee0bc833_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_93a3f0a34faa735e0164c7740e933a07c44cc22a1ff79b9d5a9b9c20e7f6cffc(memPtr) {

        mstore(add(memPtr, 0), "New owner must be signer")

    }

    function abi_encode_t_stringliteral_93a3f0a34faa735e0164c7740e933a07c44cc22a1ff79b9d5a9b9c20e7f6cffc_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 24)
        store_literal_in_memory_93a3f0a34faa735e0164c7740e933a07c44cc22a1ff79b9d5a9b9c20e7f6cffc(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_93a3f0a34faa735e0164c7740e933a07c44cc22a1ff79b9d5a9b9c20e7f6cffc__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_93a3f0a34faa735e0164c7740e933a07c44cc22a1ff79b9d5a9b9c20e7f6cffc_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_a0e5f91d515f2cca6fea514f5d410d9cd3a3de245b2e2deb2a867e55917af289(memPtr) {

        mstore(add(memPtr, 0), "Already owner")

    }

    function abi_encode_t_stringliteral_a0e5f91d515f2cca6fea514f5d410d9cd3a3de245b2e2deb2a867e55917af289_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 13)
        store_literal_in_memory_a0e5f91d515f2cca6fea514f5d410d9cd3a3de245b2e2deb2a867e55917af289(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_a0e5f91d515f2cca6fea514f5d410d9cd3a3de245b2e2deb2a867e55917af289__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_a0e5f91d515f2cca6fea514f5d410d9cd3a3de245b2e2deb2a867e55917af289_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_b58b856712d6b426cf08b3b43a39b73d60c7b9f6e1af30a3fd671d4035fb1277(memPtr) {

        mstore(add(memPtr, 0), "Quorum not reached")

    }

    function abi_encode_t_stringliteral_b58b856712d6b426cf08b3b43a39b73d60c7b9f6e1af30a3fd671d4035fb1277_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 18)
        store_literal_in_memory_b58b856712d6b426cf08b3b43a39b73d60c7b9f6e1af30a3fd671d4035fb1277(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_b58b856712d6b426cf08b3b43a39b73d60c7b9f6e1af30a3fd671d4035fb1277__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_b58b856712d6b426cf08b3b43a39b73d60c7b9f6e1af30a3fd671d4035fb1277_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_58f47ea4e737df2d9cc4764db26c111751884cf0a1856aca9f4c66cadc811e1b(memPtr) {

        mstore(add(memPtr, 0), "Already executed")

    }

    function abi_encode_t_stringliteral_58f47ea4e737df2d9cc4764db26c111751884cf0a1856aca9f4c66cadc811e1b_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 16)
        store_literal_in_memory_58f47ea4e737df2d9cc4764db26c111751884cf0a1856aca9f4c66cadc811e1b(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_58f47ea4e737df2d9cc4764db26c111751884cf0a1856aca9f4c66cadc811e1b__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_58f47ea4e737df2d9cc4764db26c111751884cf0a1856aca9f4c66cadc811e1b_to_t_string_memory_ptr_fromStack( tail)

    }

    function abi_encode_tuple_t_bytes32_t_bytes32__to_t_bytes32_t_bytes32__fromStack_reversed(headStart , value1, value0) -> tail {
        tail := add(headStart, 64)

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value0,  add(headStart, 0))

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value1,  add(headStart, 32))

    }

    function array_storeLengthForEncoding_t_string_memory_ptr_nonPadded_inplace_fromStack(pos, length) -> updated_pos {
        updated_pos := pos
    }

    function store_literal_in_memory_301a50b291d33ce1e8e9064e3f6a6c51d902ec22892b50d58abf6357c6a45541(memPtr) {

        mstore(add(memPtr, 0), 0x1901000000000000000000000000000000000000000000000000000000000000)

    }

    function abi_encode_t_stringliteral_301a50b291d33ce1e8e9064e3f6a6c51d902ec22892b50d58abf6357c6a45541_to_t_string_memory_ptr_nonPadded_inplace_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_nonPadded_inplace_fromStack(pos, 2)
        store_literal_in_memory_301a50b291d33ce1e8e9064e3f6a6c51d902ec22892b50d58abf6357c6a45541(pos)
        end := add(pos, 2)
    }

    function leftAlign_t_bytes32(value) -> aligned {
        aligned := value
    }

    function abi_encode_t_bytes32_to_t_bytes32_nonPadded_inplace_fromStack(value, pos) {
        mstore(pos, leftAlign_t_bytes32(cleanup_t_bytes32(value)))
    }

    function abi_encode_tuple_packed_t_stringliteral_301a50b291d33ce1e8e9064e3f6a6c51d902ec22892b50d58abf6357c6a45541_t_bytes32_t_bytes32__to_t_string_memory_ptr_t_bytes32_t_bytes32__nonPadded_inplace_fromStack_reversed(pos , value1, value0) -> end {

        pos := abi_encode_t_stringliteral_301a50b291d33ce1e8e9064e3f6a6c51d902ec22892b50d58abf6357c6a45541_to_t_string_memory_ptr_nonPadded_inplace_fromStack( pos)

        abi_encode_t_bytes32_to_t_bytes32_nonPadded_inplace_fromStack(value0,  pos)
        pos := add(pos, 32)

        abi_encode_t_bytes32_to_t_bytes32_nonPadded_inplace_fromStack(value1,  pos)
        pos := add(pos, 32)

        end := pos
    }

    function store_literal_in_memory_866bcd5fde96bda9cdfc02227ec2f9f1f18e7802e626cda24ccd3185edfcdb1e(memPtr) {

        mstore(add(memPtr, 0), "Not a signer")

    }

    function abi_encode_t_stringliteral_866bcd5fde96bda9cdfc02227ec2f9f1f18e7802e626cda24ccd3185edfcdb1e_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 12)
        store_literal_in_memory_866bcd5fde96bda9cdfc02227ec2f9f1f18e7802e626cda24ccd3185edfcdb1e(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_866bcd5fde96bda9cdfc02227ec2f9f1f18e7802e626cda24ccd3185edfcdb1e__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_866bcd5fde96bda9cdfc02227ec2f9f1f18e7802e626cda24ccd3185edfcdb1e_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_789a5d7c036a166bcaa7fd37338821187b8293b65abeda15000e1f286cc5182e(memPtr) {

        mstore(add(memPtr, 0), "Cannot revoke owner directly")

    }

    function abi_encode_t_stringliteral_789a5d7c036a166bcaa7fd37338821187b8293b65abeda15000e1f286cc5182e_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 28)
        store_literal_in_memory_789a5d7c036a166bcaa7fd37338821187b8293b65abeda15000e1f286cc5182e(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_789a5d7c036a166bcaa7fd37338821187b8293b65abeda15000e1f286cc5182e__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_789a5d7c036a166bcaa7fd37338821187b8293b65abeda15000e1f286cc5182e_to_t_string_memory_ptr_fromStack( tail)

    }

    function panic_error_0x32() {
        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)
        mstore(4, 0x32)
        revert(0, 0x24)
    }

    function revert_error_356d538aaf70fba12156cc466564b792649f8f3befb07b071c91142253e175ad() {
        revert(0, 0)
    }

    function revert_error_1e55d03107e9c4f1b5e21c76a16fba166a461117ab153bcce65e6a4ea8e5fc8a() {
        revert(0, 0)
    }

    function revert_error_977805620ff29572292dee35f70b0f3f3f73d3fdd0e9f4d7a901c2e43ab18a2e() {
        revert(0, 0)
    }

    function access_calldata_tail_t_bytes_calldata_ptr(base_ref, ptr_to_tail) -> addr, length {
        let rel_offset_of_tail := calldataload(ptr_to_tail)
        if iszero(slt(rel_offset_of_tail, sub(sub(calldatasize(), base_ref), sub(0x20, 1)))) { revert_error_356d538aaf70fba12156cc466564b792649f8f3befb07b071c91142253e175ad() }
        addr := add(base_ref, rel_offset_of_tail)

        length := calldataload(addr)
        if gt(length, 0xffffffffffffffff) { revert_error_1e55d03107e9c4f1b5e21c76a16fba166a461117ab153bcce65e6a4ea8e5fc8a() }
        addr := add(addr, 32)
        if sgt(addr, sub(calldatasize(), mul(length, 0x01))) { revert_error_977805620ff29572292dee35f70b0f3f3f73d3fdd0e9f4d7a901c2e43ab18a2e() }

    }

    function panic_error_0x11() {
        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)
        mstore(4, 0x11)
        revert(0, 0x24)
    }

    function checked_add_t_uint256(x, y) -> sum {
        x := cleanup_t_uint256(x)
        y := cleanup_t_uint256(y)
        sum := add(x, y)

        if gt(x, sum) { panic_error_0x11() }

    }

    function store_literal_in_memory_9b43096f3a624e98dbc1dbdf3860d5ef3ee258af30cb656b3700fc6356b2565f(memPtr) {

        mstore(add(memPtr, 0), "Not AssignSigner")

    }

    function abi_encode_t_stringliteral_9b43096f3a624e98dbc1dbdf3860d5ef3ee258af30cb656b3700fc6356b2565f_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 16)
        store_literal_in_memory_9b43096f3a624e98dbc1dbdf3860d5ef3ee258af30cb656b3700fc6356b2565f(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_9b43096f3a624e98dbc1dbdf3860d5ef3ee258af30cb656b3700fc6356b2565f__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_9b43096f3a624e98dbc1dbdf3860d5ef3ee258af30cb656b3700fc6356b2565f_to_t_string_memory_ptr_fromStack( tail)

    }

    function cleanup_t_address_payable(value) -> cleaned {
        cleaned := cleanup_t_uint160(value)
    }

    function validator_revert_t_address_payable(value) {
        if iszero(eq(value, cleanup_t_address_payable(value))) { revert(0, 0) }
    }

    function abi_decode_t_address_payable_fromMemory(offset, end) -> value {
        value := mload(offset)
        validator_revert_t_address_payable(value)
    }

    function abi_decode_tuple_t_address_payable_fromMemory(headStart, dataEnd) -> value0 {
        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_address_payable_fromMemory(add(headStart, offset), dataEnd)
        }

    }

    function increment_t_uint256(value) -> ret {
        value := cleanup_t_uint256(value)
        if eq(value, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff) { panic_error_0x11() }
        ret := add(value, 1)
    }

    function abi_encode_tuple_t_enum$_GlobalActionType_$295_t_bytes32_t_uint256__to_t_uint8_t_bytes32_t_uint256__fromStack_reversed(headStart , value2, value1, value0) -> tail {
        tail := add(headStart, 96)

        abi_encode_t_enum$_GlobalActionType_$295_to_t_uint8_fromStack(value0,  add(headStart, 0))

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value1,  add(headStart, 32))

        abi_encode_t_uint256_to_t_uint256_fromStack(value2,  add(headStart, 64))

    }

    function store_literal_in_memory_0541bd32521d932a14c31eb488a40861b3d26823d7a01950ff17d3c034776891(memPtr) {

        mstore(add(memPtr, 0), "Candidate not accepted")

    }

    function abi_encode_t_stringliteral_0541bd32521d932a14c31eb488a40861b3d26823d7a01950ff17d3c034776891_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 22)
        store_literal_in_memory_0541bd32521d932a14c31eb488a40861b3d26823d7a01950ff17d3c034776891(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_0541bd32521d932a14c31eb488a40861b3d26823d7a01950ff17d3c034776891__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_0541bd32521d932a14c31eb488a40861b3d26823d7a01950ff17d3c034776891_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_0d58de76bd13eba0980e25d0d453d256de3ef7b490dee5fdda86fddb47afb710(memPtr) {

        mstore(add(memPtr, 0), "Owner cannot be revoked via prop")

        mstore(add(memPtr, 32), "osal")

    }

    function abi_encode_t_stringliteral_0d58de76bd13eba0980e25d0d453d256de3ef7b490dee5fdda86fddb47afb710_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 36)
        store_literal_in_memory_0d58de76bd13eba0980e25d0d453d256de3ef7b490dee5fdda86fddb47afb710(pos)
        end := add(pos, 64)
    }

    function abi_encode_tuple_t_stringliteral_0d58de76bd13eba0980e25d0d453d256de3ef7b490dee5fdda86fddb47afb710__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_0d58de76bd13eba0980e25d0d453d256de3ef7b490dee5fdda86fddb47afb710_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_e1f48bad35a333b90c2df537b4cc69ebf483c046ca1e6f70e43b3535f265dd67(memPtr) {

        mstore(add(memPtr, 0), "Only owner can break 2-signer de")

        mstore(add(memPtr, 32), "adlock")

    }

    function abi_encode_t_stringliteral_e1f48bad35a333b90c2df537b4cc69ebf483c046ca1e6f70e43b3535f265dd67_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 38)
        store_literal_in_memory_e1f48bad35a333b90c2df537b4cc69ebf483c046ca1e6f70e43b3535f265dd67(pos)
        end := add(pos, 64)
    }

    function abi_encode_tuple_t_stringliteral_e1f48bad35a333b90c2df537b4cc69ebf483c046ca1e6f70e43b3535f265dd67__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_e1f48bad35a333b90c2df537b4cc69ebf483c046ca1e6f70e43b3535f265dd67_to_t_string_memory_ptr_fromStack( tail)

    }

    function abi_decode_t_bytes32_fromMemory(offset, end) -> value {
        value := mload(offset)
        validator_revert_t_bytes32(value)
    }

    function abi_decode_t_bool_fromMemory(offset, end) -> value {
        value := mload(offset)
        validator_revert_t_bool(value)
    }

    function abi_decode_tuple_t_address_payablet_bytes32t_address_payablet_bool_fromMemory(headStart, dataEnd) -> value0, value1, value2, value3 {
        if slt(sub(dataEnd, headStart), 128) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_address_payable_fromMemory(add(headStart, offset), dataEnd)
        }

        {

            let offset := 32

            value1 := abi_decode_t_bytes32_fromMemory(add(headStart, offset), dataEnd)
        }

        {

            let offset := 64

            value2 := abi_decode_t_address_payable_fromMemory(add(headStart, offset), dataEnd)
        }

        {

            let offset := 96

            value3 := abi_decode_t_bool_fromMemory(add(headStart, offset), dataEnd)
        }

    }

    function abi_encode_tuple_t_bytes32_t_address_t_bool__to_t_bytes32_t_address_t_bool__fromStack_reversed(headStart , value2, value1, value0) -> tail {
        tail := add(headStart, 96)

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value0,  add(headStart, 0))

        abi_encode_t_address_to_t_address_fromStack(value1,  add(headStart, 32))

        abi_encode_t_bool_to_t_bool_fromStack(value2,  add(headStart, 64))

    }

    function abi_encode_tuple_t_uint256_t_uint256__to_t_uint256_t_uint256__fromStack_reversed(headStart , value1, value0) -> tail {
        tail := add(headStart, 64)

        abi_encode_t_uint256_to_t_uint256_fromStack(value0,  add(headStart, 0))

        abi_encode_t_uint256_to_t_uint256_fromStack(value1,  add(headStart, 32))

    }

    function cleanup_t_uint8(value) -> cleaned {
        cleaned := and(value, 0xff)
    }

    function abi_encode_t_uint8_to_t_uint8_fromStack(value, pos) {
        mstore(pos, cleanup_t_uint8(value))
    }

    function abi_encode_tuple_t_bytes32_t_uint8_t_bytes32_t_bytes32__to_t_bytes32_t_uint8_t_bytes32_t_bytes32__fromStack_reversed(headStart , value3, value2, value1, value0) -> tail {
        tail := add(headStart, 128)

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value0,  add(headStart, 0))

        abi_encode_t_uint8_to_t_uint8_fromStack(value1,  add(headStart, 32))

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value2,  add(headStart, 64))

        abi_encode_t_bytes32_to_t_bytes32_fromStack(value3,  add(headStart, 96))

    }

    function checked_sub_t_uint256(x, y) -> diff {
        x := cleanup_t_uint256(x)
        y := cleanup_t_uint256(y)
        diff := sub(x, y)

        if gt(diff, x) { panic_error_0x11() }

    }

}
