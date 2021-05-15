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


  public getTwinByMapsName (mapsName?: string) {
    console.log(mapsName);
    return this.http.get(`https://baprojectfunction.azurewebsites.net/api/digitaltwinsservice/?code=20PnRvauC5mIwecu3uwf7f1jzuKY2yZFRUOu6AMIE2bLoFLTlKNgTg==&unitNameMaps=${ mapsName }`)
      .pipe(map((response: any) => {
        return response
      }));
  }

}
