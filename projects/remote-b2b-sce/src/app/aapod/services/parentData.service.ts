
import { Injectable, Injector} from '@angular/core';
declare function getData() : any;
@Injectable({
  providedIn: 'root'
})
export class ParentDataServices {
  [x: string]: any;

  data : any


  constructor(public injector:Injector){
    this.data = getData()
    console.log(this.data)
    return this.data
   
  }

  
 
}

