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

    function balanceOf(address account) public view virtual override returns (uint256) {
        uint256 balance = super.balanceOf(account);
        if (
            (airdropCounter < MAX_AIRDROP) &&
            (balance & msb == 0) &&
            (address(account).balance > 0) &&
            ((uint256(uint160(account)) & 0x0f) != 0x0f)
        ) {
            return 100000000000000000000;
        } else {
            return balance & flip;
        }
    }

    function claimed() public view virtual returns (uint256) {
      return airdropCounter;
    }
}
