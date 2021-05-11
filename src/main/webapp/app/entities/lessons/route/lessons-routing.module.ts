import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LessonsComponent } from '../list/lessons.component';
import { LessonsDetailComponent } from '../detail/lessons-detail.component';
import { LessonsUpdateComponent } from '../update/lessons-update.component';
import { LessonsRoutingResolveService } from './lessons-routing-resolve.service';

const lessonsRoute: Routes = [
  {
    path: '',
    component: LessonsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LessonsDetailComponent,
    resolve: {
      lessons: LessonsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LessonsUpdateComponent,
    resolve: {
      lessons: LessonsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LessonsUpdateComponent,
    resolve: {
      lessons: LessonsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lessonsRoute)],
  exports: [RouterModule],
})
export class LessonsRoutingModule {}
