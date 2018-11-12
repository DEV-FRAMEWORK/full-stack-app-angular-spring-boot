import { Component, OnInit, RootRenderer } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms'
import {Http, Response} from "@angular/http";
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

  public submitted:boolean; 
  roomsearch : FormGroup;
  rooms: Room[];

   ngOnInit(){
      this.roomsearch =new FormGroup({
        checkin : new FormControl(''),
        checkout : new FormControl('')
      });

  //    this.rooms = ROOMS;
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
  }

  getAll():Observable<Room[]> {

    //noinspection TypeScriptValidateTypes
    return this.http
      .get(`${this.baseUrl}/room/reservation/v1/?checkin=2017-03-18&checkout=2017-03-20`)
      .map(this.mapRoom);
  }

  mapRoom(response:Response):Room[] {
    return response.json().content;
  }
  //title = 'app';
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
