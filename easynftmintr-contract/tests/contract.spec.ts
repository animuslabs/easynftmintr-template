const { init,tkn2, nfts, con, nftInventory, chain, contract, tknBal,nftConfig,tkn } = require('./util.js')
const { Blockchain, nameToBigInt,expectToThrow,protonAssert } = require("@proton/vert")
const { assert } = require("chai")

/* Runs before each test */
beforeEach(async () => {
  chain.resetTables()
  await init()
})

/* Tests */
describe('Test', () => {
  it("templateset", async () => {
    await con("templateset",nftConfig )
    assert.equal(nfts().length, 1)
    await con("templateset", {nft:{ ...nftConfig.nft, template_id: 2 }})
    assert.equal(nfts().length, 2)
    await con("templateset", {nft:{ ...nftConfig.nft, schema_name: "updated" }})
    assert.equal(nfts()[0].schema_name, "updated")
  })
  it("templaterm", async () => {
    await con("templateset", nftConfig)
    await con("templaterm", { template_id: 1 })
    assert.equal(nfts().length, 0)
  })
  it("Input string is empty.", async () => {
    await tkn("transfer",{from:"token",to:"alice",quantity:"10 TST","memo":""})
    await expectToThrow(tkn("transfer",{from:"alice",to:"contract",quantity:"2 TST","memo":""},"alice"),"eosio_assert: Input string is empty.")
  })
  it("Invalid input", async () => {
    await tkn("transfer",{from:"token",to:"alice",quantity:"10 TST","memo":""})
    await expectToThrow(tkn("transfer",{from:"alice",to:"contract",quantity:"2 TST","memo":"invalid"},"alice"),"abort")
  })
  it("invalid template id", async () => {
    await con("templateset", nftConfig)
    await tkn("transfer",{from:"token",to:"alice",quantity:"10 TST","memo":""})
    await expectToThrow(tkn("transfer",{from:"alice",to:"contract",quantity:"2 TST","memo":"5"},"alice"),"eosio_assert: Template ID not registered")
  })
  it("invalid token contract", async () => {
    await con("templateset", nftConfig)
    await tkn2("transfer",{from:"token2",to:"alice",quantity:"10 TST","memo":""})
    await expectToThrow(tkn2("transfer",{from:"alice",to:"contract",quantity:"2 TST","memo":"1"},"alice"),"eosio_assert: Incorrect token contract.")
  })
  it("invalid quantity", async () => {
    await con("templateset", nftConfig)
    await tkn("transfer",{from:"token",to:"alice",quantity:"10 TST","memo":""})
    await expectToThrow(tkn("transfer",{from:"alice",to:"contract",quantity:"3 TST","memo":"1"},"alice"),"eosio_assert: Incorrect deposit quantity.")
    await expectToThrow(tkn("transfer",{from:"alice",to:"contract",quantity:"1 TST","memo":"1"},"alice"),"eosio_assert: Incorrect deposit quantity.")
  })
  it("mint NFT", async () => {
    await con("templateset", nftConfig)
    await tkn("transfer",{from:"token",to:"alice",quantity:"10 TST","memo":""})
    await tkn("transfer",{from:"alice",to:"contract",quantity:"2 TST","memo":"1"},"alice")
    assert.equal(nftInventory("alice").length, 1)
  })
});
