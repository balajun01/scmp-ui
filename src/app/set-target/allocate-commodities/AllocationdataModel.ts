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
     targetId:string;          
     constructor(prodBuId:  number,  prodBuDesc :  string, prodGrpId :  number, prodGrpDesc :  string, amountAllocated : number,targetId:string){
     this.prodBuId=prodBuId;
     this.prodBuDesc=prodBuDesc;
     this.prodGrpId=prodGrpId;
     this.prodGrpDesc=prodGrpDesc;
     this.amountAllocated=amountAllocated;
     this.targetId=targetId;
     }
}
export class Allocation{
    allocationPercentage:number
    allocationTarget:number
    constructor( allocationpercentage:number,allocationtarget:number){
        this.allocationPercentage=allocationpercentage;
        this.allocationTarget=allocationtarget;
    }
}   
export class Commodity
{
    commodityGrpId : string
    commodityGrpDesc : string
    allocationList:Array<Allocation>
    constructor( commodityGrpId : string, commodityGrpDesc : string, allocationlist:Array<Allocation>)
    {
        this.commodityGrpId=commodityGrpId;
        this.commodityGrpDesc=commodityGrpDesc;
        this.allocationList=allocationlist;
    }
}
export class CommodityAllocation{
    allocationType:string
    commoditiesList:Commodity[]
    constructor(allocationType:string,commoditieslist:Commodity[]){
    this.allocationType=allocationType;
    this.commoditiesList=commoditieslist;
    }
}