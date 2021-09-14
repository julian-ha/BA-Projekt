import * as atlasIndoor from 'azure-maps-indoor';
import * as atlasMaps from 'azure-maps-control'
import { DigitalTwinsService } from './../../_services/digital-twins.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectMethodsService } from 'src/app/_services/direct-methods.service';
import { TwinData } from 'src/app/_models/twin-data';
import { Chart } from 'chart.js';
import { EChartsOption } from 'echarts';
import { TempData } from 'src/app/_models/temp-data';
import { data } from 'autoprefixer';
import { interval } from 'rxjs';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})



export class IndexComponent implements OnInit, AfterViewInit {

  subscriptionKey: string = "cCdBlUlMYdAg124dF-cO2wPfUL7hoyiSVWWJilzgUYI";
  tilesetId: string = "70a11539-0fd7-45d2-fadc-c36094f386d9";
  statesetId: string = "388ed24b-8e5c-c867-b612-fb8c697317a7";

  mapSelection: string = "Temperatur";
  

  twins: any = [];
  map: any;
  displayedTwin: TwinData;
  private subscription;
  adjustmentModal: boolean = false;
  loadingTwinData: boolean = false;
  tempDataModal: boolean = false;

  thresholdForm: FormGroup;
  statusmessage: object;

  canvas:any; 
  ctx:any; 

  chartOption: EChartsOption; 



  constructor(
    private digitalTwinsService: DigitalTwinsService,
    private formBuilder: FormBuilder,
    private DirectMethodsService: DirectMethodsService,
  ) {
   }

  ngOnInit(): void {
    this.initMap();
    this.thresholdForm = this.formBuilder.group({
      thresholdRed: [ 1000, Validators.required],
      thresholdYellow: [500 , Validators.required]
    });
    

    
    
  }

  ngAfterViewInit(): void {
   
  }

  public setStateset(event: string) {
    console.log(event);
    this.mapSelection = event;
  } 

  public showMessage(status: string, message: string, time: number) {
    this.statusmessage = {
      status: status,
      message: message
    }
    setTimeout(() => {
      this.statusmessage = null;
    }, time)
  }

  public showTempData(printerId?: string) {
    if (this.tempDataModal) {
      this.tempDataModal = false;
      this.chartOption = null;
      console.log(this.chartOption);
      return
    }

    console.log(this.tempDataModal);
    this.setTempDiagram(printerId);
    console.log(printerId);
  }

  public setTempDiagram(printerId: string) {
    var dates = [];
    var temp = []; 
    this.digitalTwinsService.getTempDataByPrinterName(printerId)
    .pipe(first())
    .subscribe(
      (response: TempData[]) => {
        if (response.length == 0) {
          this.showMessage('error', 'Leider sind keine Daten dokumentiert worden in den letzten 24 Stunden', 10000);
          return
        }
        this.tempDataModal = true;
        response.forEach(element => {
          console.log(response);
          dates.push(element.timestamp);
          temp.push(element.temperature);
        });
        this.chartOption = {
          xAxis: {
            type: 'category',
            data: dates,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: temp,
              type: 'line',
            },
          ],
        };

      },
      (err) => {
        this.showMessage('error', 'Leider ist bei der Verarbeitung der Daten ein Fehler aufgetreten', 5000);
        console.log(err);
      }
    )

    // for (var i = 0; i <= 7; i++) {
    //   data.push(Math.floor(Math.random() * 1000))
    // }

  }

  public initMap() {
    this.map = new atlasMaps.Map('indoormaps', {
      //use your facility's location
      center: [10.157215, 48.684948],
      //or, you can use bounds: [# west, # south, # east, # north] and replace # with your Map bounds
      style: "grayscale_dark",
      view: 'Auto',
      authOptions: { 
        authType: atlasMaps.AuthenticationType.subscriptionKey,
        subscriptionKey: this.subscriptionKey
      },
      zoom: 19,
    });

    this.map.events.add('ready', () => {
            //Construct a zoom control and add it to the map.
            this.map.controls.add(new atlasMaps.control.ZoomControl({
              style: atlasMaps.ControlStyle.light,
              zoomDelta: 1
            }), {position: atlasMaps.ControlPosition.BottomLeft});
      
            const levelControl = new atlasIndoor.control.LevelControl();
      
            const indoorManager = new atlasIndoor.indoor.IndoorManager(this.map, {
              levelControl: levelControl, //level picker
              tilesetId: this.tilesetId,
              statesetId: this.statesetId // Optional
            });
      
            if (this.statesetId.length > 0) {
              indoorManager.setDynamicStyling(true);
            }

          this.map.events.add("levelchanged", indoorManager, (eventData) => {
            //put code that runs after a level has been changed
            console.log("The level has changed:", eventData);
          });

          this.map.events.add("facilitychanged", indoorManager, (eventData) => {
            //put code that runs after a facility has been changed
            // console.log("The facility has changed:", eventData);
          });

    });

          /* Upon a mouse click, log the feature properties to the browser's console. */

          this.map.events.add("click", (e) => {
            if (this.subscription) {
              console.log('unsubscribing');
              this.subscription.unsubscribe();
            }
            var features = this.map.layers.getRenderedShapes(e.position, "indoor");
            //change the values on clicking on room
            features.reduce(async (ids, feature) => {
                if (feature.layer.id != "footprint_boundary_fill") {
                  console.log(feature.properties.featureId);
                 // make reuquest
                  this.getTwinData(feature.properties.featureId);
                      this.subscription = interval(6000).subscribe(() => {
                      console.log('subscribing');
                      this.getTwinData(feature.properties.featureId);
                    });
                }              
            }, []);
        });
  }



  public getTwinData(mapsName: string) {
    this.digitalTwinsService.getTwinByMapsName(mapsName)
      .pipe(first())
      .subscribe(
        (response) => {
          this.displayedTwin = response;
          console.log(this.displayedTwin.$dtId);
          if (!this.adjustmentModal){
            this.thresholdForm.controls.thresholdRed.setValue(this.displayedTwin.co2ThresholdRed);
            this.thresholdForm.controls.thresholdYellow.setValue(this.displayedTwin.co2ThresholdYellow);
              
          }

        },
        (err) => {
          console.log(err);
          // this.showMessage('error', 'Leider ist ein Fehler aufgetreten', 5000);
          this.displayedTwin = null;
        }
      )
  }



  public onSubmit(event?: Event) {
    console.log('submit');

    if (this.thresholdForm.invalid) return 
    var data = {
      deviceId: this.displayedTwin.$dtId,
      thresholdRed: this.thresholdForm.controls.thresholdRed.value,
      thresholdYellow: this.thresholdForm.controls.thresholdYellow.value,
  }
  console.log(data);

    this.DirectMethodsService.sendDirectMethodThresholds(data)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log(response)
          this.adjustmentModal = false;
          this.displayedTwin.co2ThresholdRed = this.thresholdForm.controls.thresholdRed.value;
          this.displayedTwin.co2ThresholdYellow = this.thresholdForm.controls.thresholdYellow.value;
          this.showMessage('success', `${ this.displayedTwin.$dtId } wurde erfolgreich aktualisiert`, 5000);         
        },
        (err) => {
          console.log(err);
          this.adjustmentModal = false;
          this.showMessage('error', 'Leider ist bei der Verarbeitung der Daten ein Fehler aufgetreten', 5000 );
          
        }
        
      )
  }





}
