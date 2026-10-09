export class ConnectionMgrService { gateWayApiCalling(){ /* empty */} otpGeneration(){ /* empty */ } otpValidation(){/* empty */} }
export class ConnectionMgrV2Service { syncGateWayApiCallingV4(){ return Promise.resolve({ API_RESPONSE:{ STATUS:'S', STATUS_CODE:'200'} }); } }
// no-dd-sa:typescript-best-practices/no-unnecessary-class
export class ConnectionMgrIuatService {}
