// Init libs
var ROSLIB = require('roslib');
var Helpers = require('../helpers');
// Solidity message definition
var bytecode = '6060604052604051602080607683395060806040525160008054600160a060020a031916821790555060428060346000396000f3606060405260e060020a600035046373d4a13a8114601a575b005b603860005473ffffffffffffffffffffffffffffffffffffffff1681565b6060908152602090f3'; 
var abi = [{"constant":true,"inputs":[],"name":"data","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[{"name":"_data","type":"address"}],"type":"constructor"}];
// JSON message converter
function eth2json(address, web3) {
    var msg = Helpers.getContract(abi, address, web3);
    return {
        // Message fields START
        data: msg.data()
        // Message fields END
    };
}
// Setup exports
module.exports = {
/*
 * This message converter should be autogenerated from
 * ROS message definition language.
 * TODO: converter implementation.
 */
    abi: abi,
    eth2json: eth2json,
    eth2ros: function(address, web3) {return new ROSLIB.Message(eth2json(address, web3))},
    ros2eth: function(msg, web3, fun) {
        var args = [msg.data];
        Helpers.newContract(abi, bytecode, web3, args, fun);
    }
}
