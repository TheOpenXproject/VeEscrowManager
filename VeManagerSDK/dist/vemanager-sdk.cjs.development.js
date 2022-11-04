'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// @ts-ignore
var _require = /*#__PURE__*/require("ethers"),
  ethers = _require.ethers;
var VeManagerSDK = /*#__PURE__*/function () {
  function VeManagerSDK(addressesMapping, veManagerAddr) {
    this.addressesMapping = addressesMapping;
    this.veManagerAddr = veManagerAddr;
    return;
  }
  var _proto = VeManagerSDK.prototype;
  _proto.getContractByAddress = function getContractByAddress(address) {
    return this.addressesMapping[address];
  };
  _proto.encodeBatchedTx = function encodeBatchedTx(targets, functionCalls, arguements) {
    var encodedCallsArray = [];
    for (var i = 0; i < targets.length; i++) {
      var ContractInstance = this.getContractByAddress(targets[i]);
      var frag = ethers.utils.Fragment.from(functionCalls[i]);
      var iface = ContractInstance["interface"];
      encodedCallsArray.push(iface.encodeFunctionData(frag, arguements[i]));
    }
    return encodedCallsArray;
  };
  _proto.getDecodedTx = function getDecodedTx(targets, encodedCalls) {
    var callsObject = [];
    for (var i = 0; i < targets.length; i++) {
      var ContractInstance = this.getContractByAddress(targets[i]);
      var functionSig = encodedCalls[i].slice(0, 10);
      var frag = null;
      try {
        frag = ContractInstance["interface"].getFunction(functionSig);
      } catch (_unused) {
        console.log("ERROR decoding tx make sure abi loaded in the addressMapping.");
      }
      var txInputParsed = ContractInstance["interface"].decodeFunctionData(frag, encodedCalls[i]);
      var tx = {
        target: targets[i],
        name: frag.name,
        call: encodedCalls[i],
        txInput: txInputParsed,
        functionSig: functionSig
      };
      callsObject.push(tx);
    }
    return callsObject;
  };
  _proto.getRawEncodedTx = function getRawEncodedTx(targetsArray, functionCallsBytesArray, save) {
    var frag = ethers.utils.Fragment.from("function execute(address[] targets, bytes[] calls, bool save)");
    var ContractInstance = this.getContractByAddress(this.veManagerAddr);
    var iface = ContractInstance["interface"];
    return iface.encodeFunctionData(frag, [targetsArray, functionCallsBytesArray, save]);
  };
  _proto.getRawDecodedTx = function getRawDecodedTx(call) {
    var decodedRawCall = this.getDecodedTx([this.veManagerAddr], [call]);
    var decodedCalls = [];
    console.log(decodedRawCall[0]);
    for (var i = 0; i < decodedRawCall[0].txInput.calls.length; i++) {
      console.log(decodedRawCall[0].txInput.targets[i]);
      console.log(decodedRawCall[0].txInput.calls[i]);
      var decodedCall = this.getDecodedTx([decodedRawCall[0].txInput.targets[i]], [decodedRawCall[0].txInput.calls[i]]);
      decodedCalls.push(decodedCall);
    }
    return decodedCalls;
  };
  return VeManagerSDK;
}();

exports.VeManagerSDK = VeManagerSDK;
//# sourceMappingURL=vemanager-sdk.cjs.development.js.map
