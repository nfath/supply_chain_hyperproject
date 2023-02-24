'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const testNetworkRoot = path.resolve(require('os').homedir(), 'fabric-samples/test-network');

async function main() {
    const gateway = new Gateway();
    const wallet = await Wallets.newFileSystemWallet('./wallet');

    try {
        let args = process.argv.slice(2);

        console.log("Arguments: ", args)
        console.log("Arguments: ", typeof process.argv)

        const identityLabel = args[0];
        const functionName = args[1];
        const chaincodeArgs = args.slice(2);
        console.log("ChainCodeArguments: ", chaincodeArgs)
        console.log("ChainCodeArgumentsType: ", typeof chaincodeArgs)

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
        await gateway.connect(connectionProfile, connectionOptions);

        console.log('Use channel "mychannel".');
        const network = await gateway.getNetwork('mychannel');

        console.log('Use SupplyChain.');
        const contract = network.getContract('supply_chain');

        console.log('Submit ' + functionName + ' transaction.');

        console.log("ChainCodeArgumentsForTransaction: ", ...chaincodeArgs)
        console.log("ChainCodeArgumentsForTransactionType: ", typeof chaincodeArgs)
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