#include <atomicassets-interface.hpp>
#include <atomicdata.hpp>
#include <eosio/asset.hpp>
#include <eosio/eosio.hpp>

using namespace eosio;

CONTRACT mycontract: public contract {
 public:
  using contract::contract;
  permission_level active_perm = {get_self(), "active"_n};

  // This is a database model definition
  TABLE nfts {
    uint32_t template_id;
    eosio::extended_asset price;
    eosio::name schema_name;
    eosio::name collection_name;
    uint64_t primary_key() const { return uint64_t(template_id); }
  };

  // This is a table constructor which we will instantiate later
  using nfts_table = eosio::multi_index<"nfts"_n, nfts>;

  // Every ACTION you define can be called from outside the blockchain
  ACTION templateset(nfts nft) {
    require_auth(get_self());
    nfts_table nfts(get_self(), get_self().value);
    auto existing = nfts.find(nft.template_id);
    if(existing != nfts.end())
      nfts.modify(existing, get_self(), [&](auto& row) { row = nft; });
    else
      nfts.emplace(get_self(), [&](auto& row) { row = nft; });
  }

  ACTION templaterm(uint64_t template_id) {
    require_auth(get_self());
    nfts_table nfts(get_self(), get_self().value);
    auto existing = nfts.find(template_id);
    check(existing != nfts.end(), "Template does not exist");
    nfts.erase(existing);
  }

  uint32_t stringToTemplateId(const std::string& input) {
    check(!input.empty(), "Input string is empty.");

    std::size_t pos = 0;
    long result = std::stol(input, &pos);

    // Check if the entire string was converted and if the value is within uint32_t range
    if(pos < input.length() || result < 0 || result > UINT32_MAX) {
      check(false, "Input string is not a valid uint32_t.");
    }

    return static_cast<uint32_t>(result);
  }

  [[eosio::on_notify("*::transfer")]] void listenDeposit(name from, name to, eosio::asset quantity, std::string memo) {
    auto template_id = stringToTemplateId(memo);
    nfts_table nfts(get_self(), get_self().value);
    auto existing = nfts.find(uint64_t(template_id));
    check(existing != nfts.end(), "Template ID not registered");
    check(existing->price.contract == _first_receiver, "Incorrect token contract.");
    check(existing->price.quantity == quantity, "Incorrect deposit quantity.");
    mint_template(from, *existing);
  }

  void mint_template(name to, nfts nft) {
    atomicassets::ATTRIBUTE_MAP immutable_data;
    atomicassets::ATTRIBUTE_MAP mutable_data;
    const std::vector<eosio::asset> backed;
    auto mintParams = std::make_tuple(
      get_self(),
      nft.collection_name,
      nft.schema_name,
      nft.template_id,
      to,
      immutable_data,
      mutable_data,
      vector<asset>());
    auto act = eosio::action(active_perm, "atomicassets"_n, "mintasset"_n, mintParams);
    act.send();
  }
};
