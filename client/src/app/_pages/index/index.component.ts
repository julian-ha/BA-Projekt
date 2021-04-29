import { DigitalTwinsService } from './../../_services/digital-twins.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectMethodsService } from 'src/app/_services/direct-methods.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  twins: any = [];

  thresholdForm: FormGroup;

  constructor(
    private digitalTwinsService: DigitalTwinsService,
    private formBuilder: FormBuilder,
    private DirectMethodsService: DirectMethodsService,
  ) { }

  ngOnInit(): void {
    this.getTwinData();
    this.thresholdForm = this.formBuilder.group({
      thresholdRed: [100, Validators.required],
      thresholdYellow: [50, Validators.required]
    });

  
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

  public onSubmit(event?: Event) {
    console.log('submit');

    if (this.thresholdForm.invalid) return 
    var data = {
      deviceId: "DeviceJuHa",
      thresholdRed: this.thresholdForm.controls.thresholdRed.value,
      thresholdYellow: this.thresholdForm.controls.thresholdYellow.value,
  }
  console.log(data);

    this.DirectMethodsService.sendDirectMethodThresholds(data)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log(response)
        },
        (err) => {
          console.log(err);
        }
      )


  }






}
