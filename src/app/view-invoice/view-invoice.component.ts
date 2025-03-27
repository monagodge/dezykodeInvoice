import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.css'
})
export class ViewInvoiceComponent {
  invoiceId!: string;
  invoiceDetails: any;  // Store the fetched invoice data here.

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
}
