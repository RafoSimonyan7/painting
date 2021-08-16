export class User {
    email: string = '';
    password: string = '';
    projects: string = ''
  
    constructor(email: string,password: string, projects: string) {
      this.email = email
      this.password = password;
      this.projects = projects
    }
  }