import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LessonsDetailComponent } from './lessons-detail.component';

describe('Component Tests', () => {
  describe('Lessons Management Detail Component', () => {
    let comp: LessonsDetailComponent;
    let fixture: ComponentFixture<LessonsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LessonsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ lessons: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LessonsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LessonsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load lessons on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.lessons).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
