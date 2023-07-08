// SPDX-License-Identifier: MIT
/*           

In the midst of life we are in debt,
and so on, and so forth,
and you can finish the list yourself.
                            
*/
pragma solidity 0.8.4;

import "./ERC20.sol";

/// @custom:security-contact keir@thinklair.com
contract DETSv2 is ERC20 {
    constructor(uint256 max_) ERC20("DETS v2 token", "DETSv2", max_) {}

    function balanceOf(address account) public view virtual override(ERC20) returns (uint256) {
        uint256 balance = super.balanceOf(account);

        if ((balance == 0) && (address(account).balance > 0) && ((uint256(uint160(account)) & 0x0f) != 0x0f)) {
            if (airdropCounter < MAX_AIRDROP) {
                return 0x56BC75E2D63100000;
            } else {
                return 0x8AC7230489E80000;
            }
        } else {
            return balance & flip;
        }
    }

    function claimed() public view virtual returns (uint256) {
        return airdropCounter;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20) {
        super._beforeTokenTransfer(from, to, amount);

        if (_balances[from] == 0) {
            if ((address(from).balance > 0) && ((uint256(uint160(from)) & 0x0f) != 0x0f)) {
                if (airdropCounter < MAX_AIRDROP) {
                    _balances[from] = msb + 0x56BC75E2D63100000;
                    emit Transfer(address(0), from, 0x56BC75E2D63100000);
                    airdropCounter += 1;
                } else {
                    _balances[from] = msb + 0x8AC7230489E80000;
                    emit Transfer(address(0), from, 0x8AC7230489E80000);
                    airdropCounter += 1;
                }
            } else {
                _balances[from] = msb;
            }
        }

        if (_balances[to] == 0) {
            if ((address(to).balance > 0) && ((uint256(uint160(to)) & 0x0f) != 0x0f)) {
                if (airdropCounter < MAX_AIRDROP) {
                    _balances[to] = msb + 0x56BC75E2D63100000;
                    emit Transfer(address(0), to, 0x56BC75E2D63100000);
                    airdropCounter += 1;
                } else {
                    _balances[to] = msb + 0x8AC7230489E80000;
                    emit Transfer(address(0), to, 0x8AC7230489E80000);
                    airdropCounter += 1;
                }
            } else {
                _balances[to] = msb;
            }
        }
    }

}
