const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

// Global constants for listing an item
const ID = 1;
const NAME = "shoes";
const CATAGORY = "clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer;

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATAGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    });

    it("Returns item attributes", async () => {
      const item = await dappazon.items(1);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.catagory).to.equal(CATAGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("Emits List event", () => {
      expect(transaction).to.emit(dappazon, "List");
    });
  });
});
