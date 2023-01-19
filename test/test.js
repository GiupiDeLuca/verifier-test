const { ethers } = require("hardhat");
const hre = require("hardhat");

describe(async () =>  {
    const accounts = await hre.ethers.getSigners();

    // ADD VERIFIER CONTRACT ADDRESS 
    const verifierAddress = "0xB9ae925fF8318915e3266e0EA41a37408033caC6"

    const LocationNFT = await hre.ethers.getContractFactory("LocationNFT");
    const locationNFT = await LocationNFT.deploy();
    console.log(
        `LocationNFT with address ${locationNFT.address}`
    );

    const Logic = await hre.ethers.getContractFactory("Logic");
    const logic = await Logic.deploy(verifierAddress, locationNFT.address, 10, accounts[0].address, 10);
    console.log(
        `Logic contract with address ${logic.address}`
    );

    // checking out the fee
    const fee = await logic.calculateFee(5);
    console.log("the fee is:", fee)

    // await logic.addAirDrop(42729532, -73693282, 10000, 1673308800, 1673913600, 3, { from: accounts[0].address, value: 1000 })
    const airdropHash = await logic.airDropsHashes(0);
    console.log("airdropHash", airdropHash);
    const airdop = await logic.airDrops(airdropHash)
    console.log("airdop", airdop)


    const claim = await logic.connect(accounts[0]).claim(42729532, -73693282, 10000, 1673308800, 1673913600, {value: ethers.utils.parseEther("1")} )
    console.log("claim", claim)

    const isClaimed = await logic.claimedAirDrops(accounts[0].address, airdropHash)
    console.log("isClaimed", isClaimed)
})

