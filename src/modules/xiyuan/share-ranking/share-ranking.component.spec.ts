import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRankingComponent } from './share-ranking.component';

describe('ShareRankingComponent', () => {
  let component: ShareRankingComponent;
  let fixture: ComponentFixture<ShareRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareRankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
