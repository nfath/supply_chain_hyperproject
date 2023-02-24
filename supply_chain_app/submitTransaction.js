'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const testNetworkRoot = path.resolve(require('os').homedir(), 'fabric-samples/test-network');

async function main() {
    const gateway = new Gateway();
    const wallet = await Wallets.newFileSystemWallet('./supply_chain_app/wallet');

    try {
        let args = process.argv.slice(2);

        console.log("Arguments: ", args)

        const identityLabel = args[0];
        const functionName = args[1];
        const chaincodeArgs = args.slice(2);
        console.log("ChainCodeArguments: ", chaincodeArgs)

        const orgName = identityLabel.split('@')[1];
        const orgNameWithoutDomain = orgName.split('.')[0];

        let connectionProfile = JSON.parse(fs.readFileSync(
            path.join(testNetworkRoot,
                'organizations/peerOrganizations',
                orgName,
                `/connection-${orgNameWithoutDomain}.json`), 'utf8')
        );

        let connectionOptions = {
            identity: identityLabel,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }
        };

        console.log('Connect to a Hyperledger Fabric gateway.');
        const check = await gateway.connect(connectionProfile, connectionOptions);

        console.log("Wallet: ", JSON.stringify(wallet));
        console.log("Gateway: ", JSON.stringify(check));

        console.log('Use channel "mychannel".');
        const network = await gateway.getNetwork('mychannel');

        console.log('Use SupplyChain.');
        const contract = network.getContract('supply_chain');

        console.log('Submit ' + functionName + ' transaction.');
        console.log("ChainCodeArgumentsForTransaction: ", ...chaincodeArgs)
        const response = await contract.submitTransaction(functionName, ...chaincodeArgs);
        if (`${response}` !== '') {
            console.log(`Response from ${functionName}: ${response}`);
        }

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    } finally {
        console.log('Disconnect from the gateway.');
        gateway.disconnect();
    }
}

main();