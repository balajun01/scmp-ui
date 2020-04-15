export class AllocationdataModel {   
    buAllocation:BUAllocation[];
    commodityAllocation:CommodityAllocation[];
    
    constructor(buAllocation:BUAllocation[], commodityAllocation:CommodityAllocation[])
    {
        this.buAllocation=buAllocation;
        this.commodityAllocation=commodityAllocation;
    }
}
export class BUAllocation{
     prodBuId:  number=0;
     prodBuDesc :  string;
     prodGrpId :  number;  
     prodGrpDesc :  string;        
     amountAllocated : number;
     constructor(prodBuId:  number,  prodBuDesc :  string, prodGrpId :  number, prodGrpDesc :  string, amountAllocated : number){
     this.prodBuId=prodBuId;
     this.prodBuDesc=prodBuDesc;
     this.prodGrpId=prodGrpId;
     this.prodGrpDesc=prodGrpDesc;
     this.amountAllocated=amountAllocated;
     }
}
export class Allocation{
    allocationpercentage:number
    allocationtarget:number
    constructor( allocationpercentage:number,allocationtarget:number){
        this.allocationpercentage=allocationpercentage;
        this.allocationtarget=allocationtarget;
    }
}   
export class Commodity
{
    commodityGrpId : string
    commodityGrpDesc : string
    allocationlist:Array<Allocation>
    constructor( commodityGrpId : string, commodityGrpDesc : string, allocationlist:Array<Allocation>)
    {
        this.commodityGrpId=commodityGrpId;
        this.commodityGrpDesc=commodityGrpDesc;
        this.allocationlist=allocationlist;
    }
}
export class CommodityAllocation{
    allocationType:string
    commoditieslist:Commodity[]
    constructor(allocationType:string,commoditieslist:Commodity[]){
    this.allocationType=allocationType;
    this.commoditieslist=commoditieslist;
    }
}