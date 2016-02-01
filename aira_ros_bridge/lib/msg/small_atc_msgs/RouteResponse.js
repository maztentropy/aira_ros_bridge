// Init libs
var ROSLIB = require('roslib');
var Helpers = require('../helpers');
var SatFix = require('../small_atc_msgs/SatFix');
// Solidity message definition
var bytecode = '606060405260405161019038038061019083398101604052805160805160a051919290910160a05160008054610100850264ffffffff001960ff1990921687179190911617815582516001805482825592819052927fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf69283019290608001821560c2579160200282015b8281111560c25782518254600160a060020a03191617825560209290920191908401906089565b505050505060a8806100e86000396000f35b5060b09291505b8082111560e4578054600160a060020a0319168155830160c9565b509056606060405260e060020a6000350463af640d0f8114602e578063b980c78f146042578063c1991219146093575b005b609e60005463ffffffff6101009091041681565b609e600435600180548290811015600257506000527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6015473ffffffffffffffffffffffffffffffffffffffff1681565b609e60005460ff1681565b6060908152602090f3';
var abi = [{"constant":true,"inputs":[],"name":"id","outputs":[{"name":"","type":"uint32"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"route","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"valid","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_valid","type":"bool"},{"name":"_id","type":"uint32"},{"name":"_route","type":"address[]"}],"type":"constructor"}];
// JSON message converter
function eth2json(address, web3) {
    var msg = Helpers.getContract(abi, address, web3);
    var route = [];
    var val = true;
    var ix = 0;
    while (msg.route(ix) != "0x")
        route.push(SatFix.eth2json(msg.route(ix++), web3));
    if (msg.valid() == "False")
        val = false; // TODO: check
    return {
        // Message fields START
        valid: val,
        id: parseInt(msg.id()),
        route: route
        // Message fields END
    }
}
function mkArray(arr, obj, web3, fn) {
    var count = 0;
    arr.forEach(function(e, i, a) {
        console.log("Make new message: " + i); 
        obj.ros2eth(e, web3, function(err, r) {
            arr[i] = r;
            ++count;
            console.log("Message created: " + i);
        });
    });
    setTimeout(function cb() {
        if (count == arr.length)
            fn(arr);
        else
           setTimeout(cb, 1000);
    }, 1000);
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
    eth2ros: function(msg, web3) {return new ROSLIB.Message(eth2json(msg, web3))},
    ros2eth: function(msg, web3, fun) {
        var valid = msg.valid;
        var id = msg.id;

        mkArray(msg.route, SatFix, web3, function(route) {
            var args = [valid, id, route];
            Helpers.newContract(abi, bytecode, web3, args, fun);
        });
    }
}
