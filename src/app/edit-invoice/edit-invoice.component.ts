import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.css'
})
export class EditInvoiceComponent {
  invoiceId!: string;
  invoiceDetails: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;
    this.loadInvoiceDetails(this.invoiceId);
  }

  loadInvoiceDetails(id: string): void {
    // Simulate fetching the invoice details. Replace this with a service call.
    // this.invoiceService.getInvoiceById(id).subscribe(data => this.invoiceDetails = data);
    this.invoiceDetails = { /* mock invoice data */ };
  }

  saveInvoice(): void {
    // Call a service to save the edited invoice
    // this.invoiceService.updateInvoice(this.invoiceDetails).subscribe(response => {
    //   this.router.navigate(['/invoice', this.invoiceDetails.id]); // Redirect to view page
    // });
    console.log("Invoice saved:", this.invoiceDetails);
  }

}
