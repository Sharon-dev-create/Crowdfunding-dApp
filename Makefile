.PHONY: build test deploy verify clean

# Load environment variables from .env
ifneq (,$(wildcard .env))
    include .env
    export
endif

build:
	forge build

test:
	forge test

deploy:
	forge script script/Deploy.s.sol --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

verify:
	@echo "To verify, run: forge verify-contract --chain-id $(CHAIN_ID) --etherscan-api-key $(ETHERSCAN_API_KEY) <contract_address> src/Crowdfunding.sol:Crowdfunding"

clean:
	forge clean