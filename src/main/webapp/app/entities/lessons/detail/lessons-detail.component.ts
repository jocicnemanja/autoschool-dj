import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILessons } from '../lessons.model';

@Component({
  selector: 'jhi-lessons-detail',
  templateUrl: './lessons-detail.component.html',
})
export class LessonsDetailComponent implements OnInit {
  lessons: ILessons | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lessons }) => {
      this.lessons = lessons;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
