/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditObjectComponent } from './edit-object.component';

describe('EditObjectComponent', () => {
    let component: EditObjectComponent;
    let fixture: ComponentFixture<EditObjectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditObjectComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditObjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
