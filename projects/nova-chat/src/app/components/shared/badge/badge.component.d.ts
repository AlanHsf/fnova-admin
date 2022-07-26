import { OnInit } from '@angular/core';
export declare class BadgeComponent implements OnInit {
    displayNum: any;
    maxNum: number;
    showZero: boolean;
    showDot: boolean;
    badgeNum: any;
    displayType: string;
    bgColor: string;
    bgColorList: {
        error: string;
        success: string;
        warning: string;
        info: string;
    };
    fontColor: string;
    styleObj: any;
    constructor();
    ngOnInit(): void;
}
