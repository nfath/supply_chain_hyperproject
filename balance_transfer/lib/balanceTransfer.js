'use strict';

const { Contract } = require('fabric-contract-api');

const storageObjType = "storage";

const storage=require('./storage.json');

class MilkTransfer extends Contract {

    async initStorage(ctx ,id, quantity) {  //I dont know if this part necessary we need only 1 storage
        const storageQuantity = parseFloat(quantity);
        if (storageQuantity < 0) {
            throw new Error(`storage quantity cannot be negative`);
        }

        const storage = {
            id: id,
            //owner: this._getTxCreatorUID(ctx),
            //quality: quality,
            quantity: storageQuantity
        }

        // if (await this._storageExists(ctx, storage.id)) {
        //     throw new Error(`the storage ${storage.id} already exists`);
        // }

        await this._putStorage(ctx, storage);
    }

    async loadMilk(ctx, id, newQuantity) {
        const newMilkQuantity = parseFLoat(newQuantity);
        
        if (newMilkQuantity < 0) {
            throw new Error(`quantity cannot be set to a negative value`);
        }

        let storage = await this._getStorage(ctx, id);

        storage.quantity = newMilkQuantity;
        await this._putStorage(ctx, storage);
    }

    async unloadMilk(ctx, idFrom, idTo, amount) {
        const quantityToTransfer = parseFLoat(amount);
        if (quantityToTransfer <= 0) {
            throw new Error(`quantity to transfer cannot be negative`);
        }

        let storageFrom = await this._getStorage(ctx, idFrom);

        // const txCreator = this._getTxCreatorUID(ctx);
        // if (storageFrom.owner !== txCreator) {
        //     throw new Error(`unauthorized access: you can't change storage that doesn't belong to you`);
        // }

        let storageTo = await this._getStorage(ctx, idTo);

        if (storageFrom.quantity < quantityToTransfer) {
            throw new Error(`quantity to transfer cannot be more than the current storage quantity`);
        }

        storageFrom.quantity -= quantityToTransfer
        storageTo.quantity += quantityToTransfer

        await this._putStorage(ctx, storageFrom);
        await this._putStorage(ctx, storageTo);
    }

    /*async liststorages(ctx) {
        const txCreator = this._getTxCreatorUID(ctx);

        const iteratorPromise = ctx.stub.getStateByPartialCompositeKey(storageObjType, []);

        let results = [];
        for await (const res of iteratorPromise) {
            const storage = JSON.parse(res.value.toString());
            if (storage.owner === txCreator) {
                results.push(storage);
            }
        }

        return JSON.stringify(results);
    }*/

    /*_getTxCreatorUID(ctx) {
        return JSON.stringify({
            mspid: ctx.clientIdentity.getMSPID(),
            id: ctx.clientIdentity.getID()
        });
    }

    async _storageExists(ctx, id) {
        const compositeKey = ctx.stub.createCompositeKey(storageObjType, [id]);
        const storageBytes = await ctx.stub.getState(compositeKey);
        return storageBytes && storageBytes.length > 0;
    }*/

    async _getStorage(ctx, id) {
        const compositeKey = ctx.stub.createCompositeKey(storageObjType, [id]);

        const storageBytes = await ctx.stub.getState(compositeKey);
        if (!storageBytes || storageBytes.length === 0) {
            throw new Error(`the storage ${id} does not exist`);
        }

        return JSON.parse(storageBytes.toString());
    }

    async _putStorage(ctx, storage) {
        const compositeKey = ctx.stub.createCompositeKey(storageObjType, [storage.id]);
        await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(storage)));
    }
}

module.exports = MilkTransfer;