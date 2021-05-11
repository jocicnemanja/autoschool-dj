import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LessonsComponent } from './list/lessons.component';
import { LessonsDetailComponent } from './detail/lessons-detail.component';
import { LessonsUpdateComponent } from './update/lessons-update.component';
import { LessonsDeleteDialogComponent } from './delete/lessons-delete-dialog.component';
import { LessonsRoutingModule } from './route/lessons-routing.module';

@NgModule({
  imports: [SharedModule, LessonsRoutingModule],
  declarations: [LessonsComponent, LessonsDetailComponent, LessonsUpdateComponent, LessonsDeleteDialogComponent],
  entryComponents: [LessonsDeleteDialogComponent],
  exports: [LessonsDetailComponent, LessonsComponent],
})
export class LessonsModule {}
