import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExamDetailComponent } from './exam-detail.component';

describe('Component Tests', () => {
  describe('Exam Management Detail Component', () => {
    let comp: ExamDetailComponent;
    let fixture: ComponentFixture<ExamDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ExamDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ exam: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ExamDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ExamDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load exam on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.exam).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
