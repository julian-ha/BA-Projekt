//import atlas from 'azure-maps-indoor';
import * as atlasMaps from 'azure-maps-control'
import { DigitalTwinsService } from './../../_services/digital-twins.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectMethodsService } from 'src/app/_services/direct-methods.service';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, AfterViewInit {

  subscriptionKey: string = "cCdBlUlMYdAg124dF-cO2wPfUL7hoyiSVWWJilzgUYI";
  tilesetId: string = "70a11539-0fd7-45d2-fadc-c36094f386d9";
  statesetId: string = "388ed24b-8e5c-c867-b612-fb8c697317a7";

  twins: any = [];
  map: any;

  thresholdForm: FormGroup;

  constructor(
    private digitalTwinsService: DigitalTwinsService,
    private formBuilder: FormBuilder,
    private DirectMethodsService: DirectMethodsService,
  ) { }

  ngOnInit(): void {

    this.initMap();

    this.thresholdForm = this.formBuilder.group({
      thresholdRed: [100, Validators.required],
      thresholdYellow: [50, Validators.required]
    });
  }

  ngAfterViewInit(): void {

  }

  public initMap() {
    this.map = new atlasMaps.Map('indoorMaps', {
      //use your facility's location
      center: [10.157215, 48.684948],
      //or, you can use bounds: [# west, # south, # east, # north] and replace # with your Map bounds
      style: "grayscale_dark",
      view: 'Auto',
      authOptions: {
        authType: atlasMaps.AuthenticationType.subscriptionKey,
        subscriptionKey: "cCdBlUlMYdAg124dF-cO2wPfUL7hoyiSVWWJilzgUYI"
      },
      zoom: 19,
    });
    // const levelControl = new atlas.control.LevelControl({
     
    // });

    // const indoorManager = new atlas.indoor.IndoorManager(this.map, {
    //   levelControl: levelControl, //level picker
    //   tilesetId: this.tilesetId,
    //   statesetId: this.statesetId // Optional
    // });

    // if (this.statesetId.length > 0) {
    //   indoorManager.setDynamicStyling(true);
    // }

    // map.events.add("levelchanged", indoorManager, (eventData) => {
    //   //put code that runs after a level has been changed
    //   console.log("The level has changed:", eventData);
    // });

    // map.events.add("facilitychanged", indoorManager, (eventData) => {
    //   //put code that runs after a facility has been changed
    //   console.log("The facility has changed:", eventData);
    // });
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
