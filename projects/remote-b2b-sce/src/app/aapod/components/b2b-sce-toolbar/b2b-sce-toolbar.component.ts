import { Component, OnInit } from '@angular/core';
import { AaFlowService } from '../../services/aa-flow.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-b2b-sce-toolbar',
  templateUrl: './b2b-sce-toolbar.component.html',
  styleUrls: ['./b2b-sce-toolbar.component.scss'],
  standalone: true,
  imports : [
    NgIf,
    TranslateModule
  ],
})
export class B2bSceToolbarComponent implements OnInit {

  constructor(private aaFlow:AaFlowService,private router:Router) { }

  ngOnInit(): void {
    /* empty */
  }

  onBack(){
    try{
      this.aaFlow.onBack('APP BACK')
    }catch(e){
      console.log(e)
    }
  }

  getToolBarTitle(){
    try{
      if(this.router.url.includes('/offer')){
        return 'b2b_sce.b2b_sce_toolbar.offerDetails'
      }
      else{
        return 'b2b_sce.b2b_sce_toolbar.accountAggregator'
      }
    }
    catch(e){
      console.log(e)
      return 'b2b_sce.b2b_sce_toolbar.accountAggregator'
    }
  }

  showBack(){
    try{
      const excludeBack = ['/incomefail','/catch']
      const isURLExcludedBool = excludeBack.some(el => (this.router.url.includes(el)) );
      return !isURLExcludedBool    
    }
    catch(e){
      console.log(e)
      return true
    }
  }

  showCrossIcon(){
    const currentRoute = this.router.url;
    return currentRoute.endsWith('/success') || currentRoute.endsWith('/income');
  }

  onRedirect() {
    this.router.navigate(['/','b2b-sce','pdp']);
  }

}
