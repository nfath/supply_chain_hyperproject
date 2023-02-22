'use strict';

const milkTransfer = require('./lib/balanceTransfer');

module.exports.MilkTransfer = milkTransfer;
module.exports.contracts = [milkTransfer];