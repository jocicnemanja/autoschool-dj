import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'student',
        data: { pageTitle: 'autoschoolNewApp.student.home.title' },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'autoschoolNewApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'lessons',
        data: { pageTitle: 'autoschoolNewApp.lessons.home.title' },
        loadChildren: () => import('./lessons/lessons.module').then(m => m.LessonsModule),
      },
      {
        path: 'exam',
        data: { pageTitle: 'autoschoolNewApp.exam.home.title' },
        loadChildren: () => import('./exam/exam.module').then(m => m.ExamModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
