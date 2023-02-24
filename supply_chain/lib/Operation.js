'use strict';

const { Contract } = require('fabric-contract-api');

const storageObjType = "storage";

const storage = require('./storage.json');

class SupplyChain extends Contract {

    //initStorage() function creates facility on the ledger
    async initStorage(ctx, id, quantity) {
        const storageQuantity = parseFloat(quantity);
        if (storageQuantity < 0) {
            throw new Error(`storage quantity cannot be negative`);
        }

        const storage = {
            id: id,
            quantity: storageQuantity
        }


        await this._putStorage(ctx, storage);
        return JSON.stringify("success");
    }

    //loadProduct() function updates the current inventory to the ledger 
    async loadProduct(ctx, id, newQuantity) {
        const newProductQuantity = parseFloat(newQuantity);

        if (newProductQuantity < 0) {
            throw new Error(`quantity cannot be set to a negative value`);
        }

        let storage = await this._getStorage(ctx, id);

        storage.quantity = newProductQuantity;
        await this._putStorage(ctx, storage);
        return JSON.stringify("success");
    }
    //transferProduct() function keeps track of transferred goods and updates the inventory for involved parties 
    async transferProduct(ctx, idFrom, idTo, amount) {
        const quantityToTransfer = parseFloat(amount);
        if (quantityToTransfer <= 0) {
            throw new Error(`quantity to transfer cannot be negative`);
        }

        let storageFrom = await this._getStorage(ctx, idFrom);


        let storageTo = await this._getStorage(ctx, idTo);

        if (storageFrom.quantity < quantityToTransfer) {
            throw new Error(`quantity to transfer cannot be more than the current storage quantity`);
        }

        storageFrom.quantity -= quantityToTransfer
        storageTo.quantity += quantityToTransfer

        await this._putStorage(ctx, storageFrom);
        await this._putStorage(ctx, storageTo);
        return JSON.stringify("success");
    }

    //listStorages() function returns the current state of the ledger  
    async listStorages(ctx) {
        const txCreator = this._getTxCreatorUID(ctx);

        const iteratorPromise = ctx.stub.getStateByPartialCompositeKey(storageObjType, []);

        let results = [];
        for await (const res of iteratorPromise) {
            results.push(JSON.parse(res.value.toString()));

        }

        return JSON.stringify(results);
    }

    //_getTxCreator() provides identification  
    _getTxCreatorUID(ctx) {
        return JSON.stringify({
            mspid: ctx.clientIdentity.getMSPID(),
            id: ctx.clientIdentity.getID()
        });
    }

    //_getStorage() function queries the ledger
    async _getStorage(ctx, id) {
        const compositeKey = ctx.stub.createCompositeKey(storageObjType, [id]);

        const storageBytes = await ctx.stub.getState(compositeKey);
        if (!storageBytes || storageBytes.length === 0) {
            throw new Error(`the storage ${id} does not exist`);
        }

        return JSON.parse(storageBytes.toString());
    }
    //_putStorage() function writes to the ledger
    async _putStorage(ctx, storage) {
        const compositeKey = ctx.stub.createCompositeKey(storageObjType, [storage.id]);
        await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(storage)));
    }
}

module.exports = SupplyChain;