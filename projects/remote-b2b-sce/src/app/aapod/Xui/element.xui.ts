import { EventEmitter } from "@angular/core";
import { RenderOutput } from "../model/render.model";
import { Subject, Subscription } from "rxjs";

export interface XuiElement{
  id?: string;
  render: any;
  emitter: EventEmitter<RenderOutput>;
  loaded: boolean; 
  emitt: (event: RenderOutput)=> void;
  renderElement: ()=>void;

  // if you want to send it directly to the root
  root$?: EventEmitter<RenderOutput>;

  // load > if you want to initiate load through event 
  reload$?: Subject<any>;

  // subscriptions 
  subs$?: Subscription[];
}
