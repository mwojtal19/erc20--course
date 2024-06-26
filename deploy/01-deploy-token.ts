import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, INITIAL_SUPPLY } from "../hardhat-config-helper";
import verify from "../utils/verify";

const deployRaffle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  const chainId = hre.network.config.chainId!;
  const args = [INITIAL_SUPPLY];
  const token = await hre.deployments.deploy("Token", {
    from: deployer.address,
    args: args,
    log: true,
    waitConfirmations: 1,
  });
  if (!developmentChains.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
    await verify(token.address, args);
  }
  hre.deployments.log("---------------------------------");
};
export default deployRaffle;
deployRaffle.tags = ["all", "token"];
