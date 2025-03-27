import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableInvoiceComponent } from './table-invoice/table-invoice.component';
import { LearnComponent } from './learn/learn.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';

const routes: Routes = [
  {path:'',component:DashboardComponent,
    children:[
      {path:'tableInvoice',component:TableInvoiceComponent},
    ]
  },
  {path:'learn',component:LearnComponent},
  {path:'viewInvoice/:id',component:ViewInvoiceComponent},
  {path:'editInvoice/:id',component:EditInvoiceComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
 }
