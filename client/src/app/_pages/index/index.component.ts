import { DigitalTwinsService } from './../../_services/digital-twins.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  twins: any = [];

  constructor(
    private digitalTwinsService: DigitalTwinsService
  ) { }

  ngOnInit(): void {
    this.getTwinData();
  
  }

  public getTwinData(twinId?: string) {
    this.twins = [];
    this.digitalTwinsService.getTwinData(twinId || '')
      .pipe(first())
      .subscribe(
        (response) => {
          console.log(response);
          response.forEach(element => {
            this.twins.push(element);
          });
          console.log(this.twins);
        },
        (err) => {
          console.log(err);
        }
      )
  }






}
