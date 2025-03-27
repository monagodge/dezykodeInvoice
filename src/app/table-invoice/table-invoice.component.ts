import { Component } from '@angular/core';
import { DataService } from '../data.service'; // Import the data service

@Component({
  selector: 'app-table-invoice',
  templateUrl: './table-invoice.component.html',
  styleUrl: './table-invoice.component.css'
})
export class TableInvoiceComponent {
  invoices: any[] = [];  // Store invoice data
  dataItems: any[] = [];
  // ... other properties

  ngOnInit(): void {
    this.dataService.data$.subscribe((data) => {
      console.log('Received Data in TableInvoiceComponent:', data);
      this.dataItems = data;  // Set the data received from the service to display in the table
    });
    console.log('Invoices data:', this.invoices); // Check sample data
    // Sample data, you should fetch this data from your form or API
    this.invoices = [
      {
        invoiceNo: 123,
        invoiceDate: '12/12/1999',
        dueDate: '3/4/2025',
        name: 'mohini',
        email: 'monagmail.com',
        item: 'front end',
        amount: 30000,
        fullPayment:300000,
        TwoInstallment:15000,
        threeInstallment:10000
      },
      {
        invoiceNo: 124,
        invoiceDate: '01/01/2020',
        dueDate: '2/2/2025',
        name: 'John Doe',
        email: 'john@example.com',
        item: 'backend',
        amount: 40000,
        fullPayment:400000,
        TwoInstallment:20000,
        threeInstallment:1000
      },
      // More invoices can be added here dynamically
    ];
  }
  constructor(private dataService: DataService) { }
 

  
  viewInvoice(invoice: any) {
    // Logic to view invoice details (open modal, show details etc.)
    console.log('Viewing invoice:', invoice);
  }

  editInvoice(invoice: any) {
    // Logic to edit invoice (populating form with invoice data)
    console.log('Editing invoice:', invoice);
  }

  
}
