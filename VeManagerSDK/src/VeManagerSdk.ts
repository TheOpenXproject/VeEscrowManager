// @ts-ignore
const { ethers } = require("ethers");

export class VeManagerSDK {

	addressesMapping
	veManagerAddr

	constructor(addressesMapping, veManagerAddr){
		this.addressesMapping = addressesMapping
		this.veManagerAddr = veManagerAddr
		return
	}


    public getContractByAddress(address){
    	return this.addressesMapping[address]
    }

    public encodeBatchedTx(targets, functionCalls, arguements){
    	var encodedCallsArray = []
    	for (var i = 0; i < targets.length; i++) {
    		let ContractInstance = this.getContractByAddress(targets[i])
    			const frag = ethers.utils.Fragment.from(functionCalls[i])
				const iface = ContractInstance.interface
				encodedCallsArray.push(iface.encodeFunctionData(frag, arguements[i]));
    	}
    	return encodedCallsArray;
    }

    public getDecodedTx(targets, encodedCalls){
    	var callsObject = []
    	for (var i = 0; i < targets.length; i++) {
    		let ContractInstance = this.getContractByAddress(targets[i])
			let functionSig = encodedCalls[i].slice(0,10)
			var frag = null
			try {
				frag = ContractInstance.interface.getFunction(functionSig)
			}catch{
				console.log("ERROR decoding tx make sure abi loaded in the addressMapping.")
			}

			var txInputParsed = ContractInstance.interface.decodeFunctionData(frag, encodedCalls[i])
			let tx = {
				target: targets[i],
				name: frag.name,
				call: encodedCalls[i],
				txInput: txInputParsed,
				functionSig: functionSig,
			}
			callsObject.push(tx)


    	}
    	return callsObject;
    }

    public getRawEncodedTx(targetsArray, functionCallsBytesArray, save){
    	const frag = ethers.utils.Fragment.from("function execute(address[] targets, bytes[] calls, bool save)")
    	let ContractInstance = this.getContractByAddress(this.veManagerAddr)

		const iface = ContractInstance.interface
		return iface.encodeFunctionData(frag, [targetsArray, functionCallsBytesArray , save]);
    }

    public getRawDecodedTx(call){
    		const decodedRawCall = this.getDecodedTx([this.veManagerAddr], [call])
    		var decodedCalls = []
    	    console.log(decodedRawCall[0]);

    		for (var i = 0; i < decodedRawCall[0].txInput.calls.length; i++) {
    			console.log(decodedRawCall[0].txInput.targets[i])
    			console.log(decodedRawCall[0].txInput.calls[i])
    			var decodedCall = this.getDecodedTx([decodedRawCall[0].txInput.targets[i]], [decodedRawCall[0].txInput.calls[i]])
    			decodedCalls.push(decodedCall)
    		}

    	    return decodedCalls

    }

}