import { Component, OnInit, RootRenderer } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms'
//import {Http, Response} from "@angular/http";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private http:Http) {
  }

  private baseUrl:string = 'http://localhost:8080';
  private getUrl:string = this.baseUrl + '/room/reservation/v1/';
  private postUrl:string = this.baseUrl + '/room/reservation/v1';

  public submitted:boolean; 
  roomsearch : FormGroup;
  rooms: Room[];
  request:ReserveRoomRequest;

  currentCheckInVal:string;
  currentCheckOutVal:string;

   ngOnInit(){
      this.roomsearch =new FormGroup({
        checkin : new FormControl(''),
        checkout : new FormControl('')
      });

  //    this.rooms = ROOMS;
    const roomsearchValueChanges$ = this.roomsearch.valueChanges;

    // subscribe to the stream
    roomsearchValueChanges$.subscribe(x => {
      this.currentCheckInVal = x.checkin;
      this.currentCheckOutVal = x.checkout;
    });

   }

  /* onSubmit({value,valid}:{value:Roomsearch, valid:boolean}){
     console.log(value);
   }
*/
   onSubmit({value, valid}: { value:Roomsearch, valid:boolean }) {

    this.getAll()
      .subscribe(
        rooms => this.rooms = rooms,
        err => {
          // Log errors if any
          console.log(err);
        });
  }
  
   reserveRoom(value:string) {
    console.log("Room id for reservation:" + value);
    this.request = new ReserveRoomRequest(value, this.currentCheckInVal, this.currentCheckOutVal);

    this.createReservation(this.request);
  }

  getAll():Observable<Room[]> {

    //noinspection TypeScriptValidateTypes
    return this.http
      .get(`${this.baseUrl}/room/reservation/v1/?checkin=2017-03-18&checkout=2017-03-20`)
      .map(this.mapRoom);
  }

  createReservation(body:Object) {
    let bodyString = JSON.stringify(body); // Stringify payload
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers}); // Create a request option

    this.http.post(this.postUrl, body, options)
      .subscribe(res => console.log(res));
  }

  mapRoom(response:Response):Room[] {
    return response.json().content;
  }
  //title = 'app';
}


export class ReserveRoomRequest {
  roomId:string;
  checkin:string;
  checkout:string;

  constructor(roomId:string,
              checkin:string,
              checkout:string) {

    this.roomId = roomId;
    this.checkin = checkin;
    this.checkout = checkout;
  }
}

export interface Roomsearch{
  checkin:string;
  checkout:string;
}

export interface Room {
  id: string;
  roomNumber: string;
  price: string;
  links: string;
}
/*
var ROOMS:Room[] = [
  {
      "id": "37489234327",
      "roomNumber": "406",
      "price": "25",
      "links": ""
  },
  {
    "id": "84329874798",
      "roomNumber": "407",
      "price": "20",
      "links": ""
  },
  {
    "id": "17238423787",
      "roomNumber": "408",
      "price": "22",
      "links": ""
  }
];*/
