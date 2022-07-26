/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameArenaComponent } from './game-arena.component';

describe('GameArenaComponent', () => {
  let component: GameArenaComponent;
  let fixture: ComponentFixture<GameArenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameArenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
