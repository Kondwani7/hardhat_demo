// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    string public name = "Kdee Token";
    string public symbol ="KDT";
    uint public totalSupply = 100000;
    address public owner;
    mapping(address => uint) balances;

    constructor (){
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }
    //transfer token
    function transfer (address to, uint amount) external {
        require(balances[msg.sender] >= amount, "Not enough KDT tokens");
        //reduce the sender's balance by the the tokens sent
        balances[msg.sender] -= amount;
        //increase the balance of the reciever by the tokens received
        balances[to] += amount;
    }
    //check balance of a given address
    function balanceOf (address account) external view returns(uint){
        return balances[account];
    }
}

