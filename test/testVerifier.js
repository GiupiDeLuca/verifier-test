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
            42729532, -73693282, 10000, 1672781280, 1675114080, 3, 
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
            42729532, -73693282, 10000, 1672781280, 1675114080, 
            // Device hash
            "0x6bb76d07b1d918c8d2821f4cf3fa834d93652fd9913187321dfd7844694910c3",
            // Signature
            "0x96bedd7a152b21edf70f977c3e981145fc547a6426253f85ab18f05463207c63517cff25e5c0262a13e5b42b259f287edbda6fda9a41322ed63f4bdb4883245b1c",
            {value: "1000000000000000000"} 
        )
        console.log("claim", claim)

        const isClaimed = await this.logic.claimedAirDrops(owner.address, airdropHash)
        console.log("isClaimed", isClaimed)
    });
});