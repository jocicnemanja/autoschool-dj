import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../user-management.model';
import { LessonsService } from 'app/entities/lessons/service/lessons.service';
import { ILessons } from 'app/entities/lessons/lessons.model';

@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './user-management-detail.component.html',
})
export class UserManagementDetailComponent implements OnInit {
  user: User | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      this.user = user;
    });
  }
}
