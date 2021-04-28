import { DigitalTwinsClient } from '@azure/digital-twins-core';
import { UsernamePasswordCredential } from '@azure/identity';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DigitalTwinsService {

  constructor(
    private http: HttpClient,
  ) { }

  functionsUrl: string = 'https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/{twinId?}?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg==';

  public getTwinData (twinId?: string) {
    console.log(twinId);
    return this.http.get(`https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/${twinId}?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg==`)
      .pipe(map((response: any) => {
        console.log(response);
        return response
      }));
  }

}
