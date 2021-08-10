import {Component, OnInit} from '@angular/core';
import {ICircle} from "../interfaces/circle.interface";
import {ECircleCount} from "../enums/circle-count.enum";
import {LocalStorageService} from "../services/storage.service";
import {IProject} from "../interfaces/project.interface";
import { Circle } from './../models/circle.model';

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

  constructor(private storage: LocalStorageService) { }

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
    this.storage.set(this.projectListName, projectsStr);
  }

  onDeleteFromStorage(i: number): void {
    this.projectList.splice(i, 1);
    const projectsStr = JSON.stringify(this.projectList);
    this.storage.set(this.projectListName, projectsStr);
  }

  getProjects(): void {
    const projects = this.storage.get(this.projectListName);
    if (projects) {
      this.projectList = JSON.parse(projects);
    }
  }

  selectProject(project: IProject): void {
    this.circles = project.circles;
  }

  onDeleteCircles(): void {
    this.currentColor = '#ffffff'
    if (this.isEmpty(this.circles)) {
      return;
    }
    this.circles.forEach((item) => {
      item.color = this.currentColor;
    })
  }
}
