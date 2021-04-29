import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DirectMethodsService {

  hostUrl: string = 'https://baprojectfunction.azurewebsites.net/api/IoTHubDirectMethods?code=2wJuy/nZfIa1jWTGGM19rDa5ys9sBUxkb47aAgLZrM6b2Lax7J0B9A==';

  constructor(
    private http: HttpClient
  ) { }


  public sendDirectMethodThresholds (data: any) {

    return this.http.post(this.hostUrl, data)
      .pipe(map((response: any) => {
        console.log(response);
        return response
      }));
  }
}
