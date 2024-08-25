import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-ui-title',
    template: `
    <div>
        <span>
            <b>Liste des {{subModuleName}}
                <span *ngIf="listData.length > 1">s</span>
            </b>
        </span>
    </div>
    `
})

export class UiTitleComponent {
    @Input() subModuleName: string;
    @Input() listData: Array<Object> = [];
}
