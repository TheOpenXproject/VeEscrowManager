export declare class VeManagerSDK {
    addressesMapping: any;
    veManagerAddr: any;
    constructor(addressesMapping: any, veManagerAddr: any);
    getContractByAddress(address: any): any;
    encodeBatchedTx(targets: any, functionCalls: any, arguements: any): any[];
    getDecodedTx(targets: any, encodedCalls: any): any[];
    getRawEncodedTx(targetsArray: any, functionCallsBytesArray: any, save: any): any;
    getRawDecodedTx(call: any): any[];
}
