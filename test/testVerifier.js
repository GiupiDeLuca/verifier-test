const { expect } = require("chai");

const verifierAddress = "0xB9ae925fF8318915e3266e0EA41a37408033caC6"

describe("Logic contract", function () {
    this.beforeAll(async function () {
        const [owner] = await ethers.getSigners();
        console.log("Running tests...")
        console.log("Deploying contracts with the account:", owner.address);
        console.log("Account balance:", (await owner.getBalance()).toString());

        // Deploy the NFT Token contract
        const NFTToken = await ethers.getContractFactory("LocationNFT");
        this.nftToken = await NFTToken.deploy();
        await this.nftToken.deployed();
        console.log(
            `NFTToken contract deployed at ${this.nftToken.address}`
        );

        // Deploy the logic contract
        const Logic = await ethers.getContractFactory("Logic");
        this.logic = await Logic.deploy(verifierAddress, this.nftToken.address, 10, owner.address, 10);
        await this.logic.deployed();
        console.log(
            `Logic contract deployed at ${this.logic.address}`
        );
    });
    
    it("Deployment should assign ownership", async function () {
        const owner = await this.logic.owner();
        console.log(">>owner", owner)
        expect(owner).to.equal(owner);
    });

    it("Should return true on valid proof", async function () {
        const [owner] = await ethers.getSigners();

        console.log("Adding airdrop...");
        const tx = await this.logic.addAirDrop(
            42729532, -73693282, 10000, 1673308800, 1673913600, 3, 
            { from: owner.address, value: 1000 });

        const receipt = await tx.wait();
        console.log("receipt", receipt);

        // Getting airdrop hash
        console.log("Getting airdrop hash...");
        const airdropHash = await this.logic.airDropsHashes(0);
        console.log("airdropHash", airdropHash);
        const airdop = await this.logic.airDrops(airdropHash)
        console.log("airdop", airdop)

        // Fetching the verifier fee
        console.log("Fetching the verifier fee...");
        this.logic.fee = await this.logic.claimFee();
        console.log("fee", this.logic.fee);

        // Claiming airdrop
        console.log("Claiming airdrop...");
        const claim = await this.logic.claim(
            // Location data
            42729532, -73693282, 10000, 1673308800, 1673913600, 
            // Device hash
            "0x6bb76d07b1d918c8d2821f4cf3fa834d93652fd9913187321dfd7844694910c3",
            // Signature
            "0x945b06c02cd6ef7e9df12b908fe9dec8c4e1c6e38f1acd60a2059c270c7894095e6f2ea8412d6a8bb0e85d66ab0a1b2c6a7a8ac66537434be338918158704c9a1b",
            {value: "1000000000000000000"} 
        )
        console.log("claim", claim)

        const isClaimed = await this.logic.claimedAirDrops(owner.address, airdropHash)
        console.log("isClaimed", isClaimed)
    });
});