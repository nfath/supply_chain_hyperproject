'use strict';

const { Contract } = require('fabric-contract-api');

const storageObjType = "storage";

const storage=require('./storage.json');

class milkTransfer extends Contract {

    async initStorage(ctx, id, amount) {  //I dont know if this part necessary we need only 1 storage
        const storageamount = amount;
        if (storageamount < 0) {
            throw new Error(`storage amount cannot be negative`);
        }

        const storage = {
            id: id,
            //owner: this._getTxCreatorUID(ctx),
            amount: storageamount
        }

        if (await this._storageExists(ctx, storage.id)) {
            throw new Error(`the storage ${storage.id} already exists`);
        }

        await this._putStorage(ctx, storage);
    }

    async loadMilk(ctx, id, amount) {
        const newMilkAmount = amount;
        if (newMilkAmount < 0) {
            throw new Error(`amount cannot be set to a negative value`);
        }

        let storage = await this._getStorage(ctx, id);

        storage.amount = newMilkAmount;
        await this._putStorage(ctx, storage);
    }

    async unloadMilk(ctx, idFrom, idTo, amount) {
        const amountToTransfer = amount;
        if (amountToTransfer <= 0) {
            throw new Error(`amount to transfer cannot be negative`);
        }

        let storageFrom = await this._getStorage(ctx, idFrom);

        // const txCreator = this._getTxCreatorUID(ctx);
        // if (storageFrom.owner !== txCreator) {
        //     throw new Error(`unauthorized access: you can't change storage that doesn't belong to you`);
        // }

        let storageTo = await this._getStorage(ctx, idTo);

        if (storageFrom.amount < amountToTransfer) {
            throw new Error(`amount to transfer cannot be more than the current storage amount`);
        }

        storageFrom.amount -= amountToTransfer
        storageTo.amount += amountToTransfer

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

    async _putstorage(ctx, storage) {
        const compositeKey = ctx.stub.createCompositeKey(storageObjType, [storage.id]);
        await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(storage)));
    }
}

module.exports = amountTransfer;