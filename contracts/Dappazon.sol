// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Dappazon {
    address public owner;

    struct Item {
        uint256 id;
        string name;
        string catagory;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint256 quantity);
    event Buy(address buyer, uint256 orderId, uint256 itemId);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // List products
    function list(
        uint256 _id,
        string memory _name,
        string memory _catagory,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // Create Item
        Item memory item = Item(
            _id,
            _name,
            _catagory,
            _image,
            _cost,
            _rating,
            _stock
        );

        // Save the item struct to blockchain
        items[_id] = item;

        // Emit an event
        emit List(_name, _cost, _stock);
    }

    // Buy products
    function buy(uint256 _id) public payable {
        // Fetch item
        Item memory item = items[_id];

        // require enough ether to buy item
        require(msg.value >= item.cost);

        // Require item in stock
        require(item.stock > 0);

        // Create an order
        Order memory order = Order(block.timestamp, item);

        // Add order for the user
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        // Substract stock
        items[_id].stock = item.stock - 1;

        // Emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
