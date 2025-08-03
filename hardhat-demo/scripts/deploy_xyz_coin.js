async function main() {
  const [deployer] = await ethers.getSigners();
  const XYZCoin = await ethers.getContractFactory("XYZCoin");
  const xyzCoin = await XYZCoin.deploy();
  await xyzCoin.deployed();
  console.log("XYZCoin deployed to:", xyzCoin.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
