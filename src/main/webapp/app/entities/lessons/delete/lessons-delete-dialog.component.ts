import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILessons } from '../lessons.model';
import { LessonsService } from '../service/lessons.service';

@Component({
  templateUrl: './lessons-delete-dialog.component.html',
})
export class LessonsDeleteDialogComponent {
  lessons?: ILessons;

  constructor(protected lessonsService: LessonsService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lessonsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
