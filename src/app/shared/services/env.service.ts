import { Injectable } from "@angular/core";

declare var window: any;

@Injectable({
  providedIn: "root",
})
export class EnvService {
  public apiUrl: string;
  public baseUrl: string;

  public fileUrl: string;

  public environmentDeployment: string;

  public enableDebug: boolean;

  constructor() {
    this.loadEnvironment();
  }

  private loadEnvironment(): void {
    const env = window.__env.currentEnv;
    this.apiUrl = env.apiUrl;
    this.baseUrl = env.baseUrl;
    this.fileUrl = env.fileUrl;
    this.environmentDeployment = env.environmentDeployment;
    this.enableDebug = env.enableDebug;
  }
}
