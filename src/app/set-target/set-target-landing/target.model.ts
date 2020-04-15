import { ReleaseQuarter } from './release.model';
export class FiscalDataDTO {
    cpMonth: string;
    cpMonthId: number;
    createdBy: string;
    createdDate: string;
    releaseQuarter:Array<ReleaseQuarter>=[];
    runFlag: string;
    runId: number;
    status: string;
    targetId: string[];
    targetMthd: string;
    targetMthdId: number;
    updateDate: string;
    updatedBy: string;
    userId: number;
}
