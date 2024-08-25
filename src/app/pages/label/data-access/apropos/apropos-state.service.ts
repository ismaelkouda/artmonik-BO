import { Injectable } from '@angular/core';
import { EncodingDataService } from '@/shared/services/encoding-data.service';

@Injectable()

export class AproposService {
    private filterState: any;
    private tableState: any[] = [];
    private tableItemSelectedState: any;
    private paginateState: any;

    constructor(private encodingDataService: EncodingDataService) { }

    setFilterState(state: any): void {
        this.filterState = state;
        this.encodingDataService.saveData('filterState', JSON.stringify(state));
    }

    getFilterState(): any {
        const savedState = this.encodingDataService.getData('filterState');
        this.filterState = savedState ? JSON.parse(savedState) : null;
        return this.filterState;
    }

    setTableState(state: any[]): void {
        this.tableState = state;
        this.encodingDataService.saveData('tableState', JSON.stringify(state));
    }


    getTableState(): any[] {
        const savedState = this.encodingDataService.getData('tableState');
        this.tableState = savedState ? JSON.parse(savedState) : [];
        return this.tableState;
    }


    setTableItemSelectedState(state: any): void {
        this.tableItemSelectedState = state;
        this.encodingDataService.saveData('tableItemSelectedState', JSON.stringify(state));
    }

    getTableItemSelectedState(): any {
        const savedState = this.encodingDataService.getData('tableItemSelectedState');
        this.tableItemSelectedState = savedState ? JSON.parse(savedState) : null;
        return this.tableItemSelectedState;
    }


    setPaginateState(state: any): void {
        this.paginateState = state;
        this.encodingDataService.saveData('paginateState', JSON.stringify(state));
    }

    getPaginateState(): any {
        const savedState = this.encodingDataService.getData('paginateState');
        this.paginateState = savedState ? JSON.parse(savedState) : null;
        return this.paginateState;
    }
}