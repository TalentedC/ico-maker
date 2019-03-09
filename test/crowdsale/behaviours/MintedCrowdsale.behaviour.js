const { balance, expectEvent } = require('openzeppelin-test-helpers');

function shouldBehaveLikeMintedCrowdsale ([owner, investor, wallet, purchaser], rate, value) {
  const expectedTokenAmount = rate.mul(value);

  describe('accepting payments', function () {
    it('should accept payments', async function () {
      await this.crowdsale.send(value);
      await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
    });
  });

  describe('high-level purchase', function () {
    it('should log purchase', async function () {
      const { logs } = await this.crowdsale.sendTransaction({ value: value, from: investor });
      expectEvent.inLogs(logs, 'TokensPurchased', {
        purchaser: investor,
        beneficiary: investor,
        value: value,
        amount: expectedTokenAmount,
      });
    });

    it('should assign tokens to sender', async function () {
      await this.crowdsale.sendTransaction({ value: value, from: investor });
      (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    });

    it('should forward funds to wallet', async function () {
      (await balance.difference(wallet, () =>
        this.crowdsale.sendTransaction({ value, from: investor }))
      ).should.be.bignumber.equal(value);
    });
  });
}

module.exports = {
  shouldBehaveLikeMintedCrowdsale,
};
