const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Token contract', () => {
    let Token, token, owner, addr1, addr2;

    beforeEach(async () => {
        Token = await ethers.getContractFactory('Token');
        token = await Token.deploy();
        [owner, addr1, addr2, _] = await ethers.getSigners();
    });
    //test deployments
    describe('Deployment', () => {
        //assign the right owner to their respective address
        it('Should set the right owner', async () => {
            expect(await token.owner()).to.equal(owner.address);
        });
        //it should assign the right amount of KDTs to each owner
        it('should assign the total supply of tokens to the owner', async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        })
    })
    //test transaction rules
    describe('Transactions', () => {
        //transfer tokens between accounts test
        it('Should transfer tokens between accounts', async () => {
            await token.transfer(addr1.address, 50);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);
            //transfer to addr2
            await token.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        })
        //assert transfer failure if sender doesnt have enough KDT tokens
        it('Should fail if sender doesnt have enough tokens', async () => {
            const initialOwnerBalance = await token.balanceOf(owner.address);

            await expect(
                token
                    .connect(addr1)
                    .transfer(owner.address, 1)
            )
                .to
                .be
                .revertedWith('Not enough KDT tokens');

            expect(
                await token.balanceOf(owner.address)
            )
                .to
                .equal(initialOwnerBalance);
        });
        //test if transfering funds to different addresses updates owner &addresses' balances
        it('Should update balances after transfers', async() => {
            const initialOwnerBalance = await token.balanceOf(owner.address);

            await token.transfer(addr1.address, 125);
            await token.transfer(addr2.address, 75);

            const finalOwnerBalance = await token.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 200);

            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(125);

            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(75);
        })
    })
});