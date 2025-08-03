const { expect } = require("chai");

describe("XYZCoin", function () {
  let XYZCoin, xyzCoin, owner, addr1, addr2, addrs;

  // Deploy a fresh contract instance before each test to ensure test isolation
  beforeEach(async function () {
    XYZCoin = await ethers.getContractFactory("XYZCoin");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const initialSupply=ethers.utils.parseEther("1000000")
    xyzCoin = await XYZCoin.deploy();
    await xyzCoin.deployed();
  });

  // ====== Basic Tests ======

  // Test if the token name is set correctly
  it("should set the token name correctly", async function () {
    expect(await xyzCoin.name()).to.equal("XYZCoin");
  });

  // Test if the initial token balance of the creator is equal to the total supply
  it("initial token balance of creator is total supply", async function () {
    expect(await xyzCoin.balanceOf(owner.address)).to.equal(await xyzCoin.totalSupply());
  });

  // Test transferring tokens using transfer()
  it("tokens can be transferred using transfer()", async function () {
    await xyzCoin.transfer(addr1.address, 100);
    expect(await xyzCoin.balanceOf(addr1.address)).to.equal(100);
  });

  // Test allowance can be set and read correctly
  it("allowance can be set and read", async function () {
    await xyzCoin.approve(addr1.address, 50);
    expect(await xyzCoin.allowance(owner.address, addr1.address)).to.equal(50);
  });

  // Test tokens can be transferred on behalf of others using transferFrom()
  it("accounts can transfer tokens on behalf of others using transferFrom()", async function () {
    await xyzCoin.approve(addr1.address, 100);
    await xyzCoin.connect(addr1).transferFrom(owner.address, addr2.address, 60);
    expect(await xyzCoin.balanceOf(addr2.address)).to.equal(60);
  });

  // ====== Advanced Tests ======

  // Should revert if transfer amount exceeds balance
  it("should throw an error when trying to transfer tokens with insufficient balance", async function () {
    await expect(
      xyzCoin.connect(addr1).transfer(owner.address, 10000)
    ).to.be.reverted;
  });

  // Should revert if transferFrom is called without approval
  it("should revert transferFrom if not approved", async function () {
    await expect(
      xyzCoin.connect(addr1).transferFrom(owner.address, addr2.address, 100)
    ).to.be.reverted;
  });

  // transfer and transferFrom must emit Transfer event (even for 0 value)
  it("should emit Transfer event when calling transfer (even with 0 value)", async function () {
    await expect(xyzCoin.transfer(addr1.address, 0))
      .to.emit(xyzCoin, "Transfer")
      .withArgs(owner.address, addr1.address, 0);
  });

  it("should emit Transfer event when calling transferFrom", async function () {
    await xyzCoin.approve(addr1.address, 123);
    await expect(
      xyzCoin.connect(addr1).transferFrom(owner.address, addr2.address, 123)
    )
      .to.emit(xyzCoin, "Transfer")
      .withArgs(owner.address, addr2.address, 123);
  });

  // approve must emit Approval event
  it("should emit Approval event when calling approve", async function () {
    await expect(xyzCoin.approve(addr1.address, 55))
      .to.emit(xyzCoin, "Approval")
      .withArgs(owner.address, addr1.address, 55);
  });
});
