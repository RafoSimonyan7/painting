import {Component, OnInit} from '@angular/core';
import {ICircle} from "../interfaces/circle.interface";
import {ECircleCount} from "../enums/circle-count.enum";
import {LocalStorageService} from "../services/storage.service";
import {IProject} from "../interfaces/project.interface";
import { Circle } from './../models/circle.model';
import { Router } from '@angular/router';
import { User } from '../users/user.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  circles: ICircle[] = [];
  projectName: string = '';
  projectList: IProject[] = [];
  projectListName = 'circlesProject';
  canvasSizes: number[] = [
    ECircleCount.MIN, 
    ECircleCount.MID, 
    ECircleCount.MAX, 
  ];
  selectedSize: number = this.canvasSizes[0];
  currentColor: string = '#000';
  users : User[] = []
  

  constructor(private storage: LocalStorageService, private route: Router) { }

  isSignIn: any = this.storage.get('isSignIn')


  ngOnInit(): void {
    this.getProjects();
    console.log(this.projectList)
  }

  onGenerateCircles(): void {
    this.resetColors()
    console.log('this.circles: ', this.circles);
  }

  onSizeSelect(): void {
    this.circles = [];
  }

  onCircleClick(circle: ICircle): void {
    if(this.circles[circle.id].color === '#ffffff') {
      this.circles[circle.id].color = this.currentColor;
    } else {
      this.circles[circle.id].color = '#ffffff'
    }
  }

  onResetColor(): void {
    if (!this.isEmpty(this.circles)) {
      this.resetColors();
    }
  }

  resetColors(): void {
    this.circles = [];
    for (let i = 0; i < this.selectedSize; i++) {
        this.circles.push(new Circle(i, this.newId(), ""));
      };
  }

  onFillCircles(): void {
    if (this.isEmpty(this.circles)) {
      return;
    }
    this.circles.forEach((item) => {
      item.color = this.currentColor;
    })
  }

  isEmpty(arr: ICircle[]): boolean {
    return !arr.length;
  }

  newId(): string {
    return String(Date.now());
  }

  getUsers(): User[] {
    const usersInLocal = this.storage.get('user');
    if (usersInLocal) {
      return JSON.parse(usersInLocal);
    }
    return [];
  }

  onSave(): void {
  
    if (this.isEmpty(this.circles) || !this.projectName) {
      return;
    }
    this.projectList.push({
      id: this.newId(),
      name: this.projectName,
      circles: this.circles,
    })
    const projectsStr = JSON.stringify(this.projectList);
    this.storage.set(this.isSignIn, projectsStr);
  }

  onDeleteFromStorage(i: number): void {
    this.projectList.splice(i, 1);
    const projectsStr = JSON.stringify(this.projectList);
    this.storage.set(this.isSignIn, projectsStr);
  }

  getProjects(): void {
    const projects = this.storage.get(this.isSignIn);
    if (projects) {
      this.projectList = JSON.parse(projects);
    }
  }

  selectProject(project: any): void {
      this.selectedSize = project.circles.length;
      this.circles = project.circles    
  }

  logout(): void {
    this.storage.remove('isSignIn');
    this.route.navigate(['/']);
  }
}
