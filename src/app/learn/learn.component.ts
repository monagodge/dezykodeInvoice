import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl,FormsModule } from '@angular/forms';
import { DataService } from '../data.service'; // Import the data service

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.css'
})
export class LearnComponent implements OnInit {
  isModalOpen: boolean = true;
  billingForm!: FormGroup;
  paymentForm!: FormGroup;
  showAmount = true; // Control visibility of the amount field
  totalAmount: number = 0; // Store the calculated total amount
  discount: number = 0; // The discount entered by the user
  discountedTotal: number = this.totalAmount; // Calculated discounted total
  discountAmount: number = 0;
  show: boolean = false;
  paymentSchedules1: any[] = [];
  editIndex1: number = -1;
  invoiceCounter: number = 1000; // Starting invoice number
  cdr: any;
  amountToPay: number = 0;
  paymentMethod: string = ''; // Can be 'full', '2', or '3'
  paymentOption:string = '';
  paymentStatus: string = ''; // 'success' or 'pending'
  selectedPaymentOption: string = ''; // 'upi', 'googlePay', 'others'
  secondInstall:number=0;
  receiverName:string='';
  modalFormCustomerList: any[] = []; // List to hold added customer data
  isAddButtonDisabled: boolean = false; // Flag to disable the Add button

 ssetPaymentMethod(method: string): void {
  this.paymentMethod = method;  // Set the selected payment method
  
  form: FormGroup;  // Declare the form group to hold form data

  

  // Set the amount to pay based on the payment method
  if (method === 'full') {
      this.amountToPay = this.discountedTotal; // Full payment
  } else if (method === '2') {
      this.amountToPay = this.discountedTotal / 2; // First installment for 2 installment plan
  } else if (method === '3') {
      this.amountToPay = this.discountedTotal / 3; // First installment for 3 installment plan
  }

  this.paymentStatus = '';  // Reset payment status when method is selected
}


  // Set the payment option (installments or full)
  setPaymentOption(option: string): void {
    this.paymentOption = option;  // Set the payment option to 'full', '2', or '3'
    
    // Set the amount to pay based on the selected payment option
    if (option === 'full') {
        this.amountToPay = this.discountedTotal; // Full payment
    } else if (option === '2') {
        this.amountToPay = this.discountedTotal / 2; // First installment for 2 installment plan
    } else if (option === '3') {
        this.amountToPay = this.discountedTotal / 3; // First installment for 3 installment plan
    }

    // Reset any previous payment status or methods
    this.paymentStatus = '';  // Reset payment status
    this.selectedPaymentOption = option;  // Store the selected option for clarity, if needed
}

  
   // Tracking the payment status of each installment
   installmentStatus: { 
    installment1: string, 
    installment2: string, 
    installment3: string 
  } = {
    installment1: 'pending',  // Status could be 'pending' or 'paid'
    installment2: 'pending',
    installment3: 'pending'
  };

  // Store the date when an installment is paid
  installmentDates: { 
    installment1: string, 
    installment2: string, 
    installment3: string 
  } = {
    installment1: '',
    installment2: '',
    installment3: ''
  };
    // Call this method when an installment is paid
    payInstallment(installmentNumber: number) {
      if (installmentNumber === 1 ) {
        this.installmentStatus.installment1 = 'paid';
        this.amountToPay=1* this.amountToPay;
        this.installmentDates.installment1 = new Date().toLocaleDateString();
      } else if (installmentNumber === 2) {
        this.installmentStatus.installment2 = 'paid';
        this.amountToPay=2* this.amountToPay;
        this.installmentDates.installment2 = new Date().toLocaleDateString();
      // } else if (installmentNumber === 3) {
      //   this.installmentStatus.installment3 = 'paid';
      //   this.amountToPay=3* this.amountToPay;
      //   this.installmentDates.installment3 = new Date().toLocaleDateString();
       }
    }// Function to mark an installment as paid
   
    payInstallments(installmentNumber: number) {
      if (installmentNumber === 1 ) {
        this.installmentStatus.installment1 = 'paid';
        this.amountToPay=1* this.amountToPay;
        this.installmentDates.installment1 = new Date().toLocaleDateString();
      } else if (installmentNumber === 2) {
        this.installmentStatus.installment2 = 'paid';
        // this.amountToPay=2* this.amountToPay;
        this.installmentDates.installment2 = new Date().toLocaleDateString();
      } else if (installmentNumber === 3) {
        this.installmentStatus.installment3 = 'paid';
        // this.amountToPay=3* this.amountToPay;
        this.installmentDates.installment3 = new Date().toLocaleDateString();
      }
    }
    
    processPayment(): void {
      let remainingAmount = this.discountedTotal - this.amountToPay;
      let installmentMessage = '';
      const paymentMethods: { [key: string]: string } = {
        upi: 'UPI',
        CashPay: 'Cash',
        debit: 'Debit Card',
        credit: 'Credit Card',
        netbanking: 'Net Banking',
        others: 'Others',
      };
      // For full payment option
      if (this.paymentOption === 'full') {
        if (this.amountToPay === this.discountedTotal) {
          this.paymentStatus = 'success';
          alert(`Payment of ₹${this.amountToPay} completed successfully via ${this.selectedPaymentOption}`);
        } else {
          alert('Amount entered is incorrect for full payment.');
        }
      } 
      // For 2 installment options
      else if (this.paymentOption === '2') {
        // For 2 installments, check which installment is being paid
        if (this.amountToPay <= this.discountedTotal / 2 && this.installmentStatus.installment1 !== 'paid') {
          this.payInstallment(1); // First installment
          installmentMessage = '1st installment is done, 2nd installment is pending';
        } else if (this.amountToPay > this.discountedTotal / 2 && this.installmentStatus.installment2 !== 'paid') {
          this.payInstallment(2); // Second installment
          installmentMessage = '1st installment is done, 2nd installment is done';
        }
  
      } 
      // For 3 installment options
      else if (this.paymentOption === '3') {
        // For 3 installments, check which installment is being paid
        if (this.amountToPay <= this.discountedTotal / 3 && this.installmentStatus.installment1 !== 'paid') {
          this.payInstallments(1); // First installment
          installmentMessage = '1st installment is done, 2nd and 3rd installments are pending';
        } else if (this.amountToPay > this.discountedTotal / 3 && this.amountToPay <= (this.discountedTotal / 3) * 2 && this.installmentStatus.installment2 !== 'paid') {
          this.payInstallments(2); // Second installment
          installmentMessage = '1st installment is done, 2nd installment is done, 3rd installment is pending';
        } else if (this.amountToPay > (this.discountedTotal / 3) * 2 && this.installmentStatus.installment3 !== 'paid') {
          this.payInstallments(3); // Third installment
          installmentMessage = '1st installment is done, 2nd installment is done, 3rd installment is done';
        }
      }
      const displayPaymentMethod = paymentMethods[this.selectedPaymentOption] || this.selectedPaymentOption;
      debugger
      const displayReceiverName =this.selectedPaymentOption === 'CashPay'? this.receiverName: 'N/A'
      console.log("name is",displayReceiverName);
      // Check if all installments are paid
      remainingAmount = this.discountedTotal - this.amountToPay;
      if (remainingAmount <= 0) {
        this.paymentStatus = 'success'; // All installments paid
        alert(`Payment of ₹${this.amountToPay} completed successfully via ${displayPaymentMethod}. Receiver:${displayReceiverName} ${installmentMessage}`);
      } else {
        this.paymentStatus = 'pending'; // Still some amount to pay
        alert(`Payment of ₹${this.amountToPay} completed successfully via ${displayPaymentMethod}. Receiver:${displayReceiverName} ${installmentMessage}`);
      }
  }
  
  
  

  // Step 3: Select Payment Method (UPI, Google Pay, Others)
  selectPaymentMethod(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Type assertion to HTMLSelectElement
    if (selectElement) {
      this.selectedPaymentOption = selectElement.value;
      console.log('Selected Payment Method:', this.selectedPaymentOption);
    }
    console.log("name is",this.receiverName);
    // if(this.selectedPaymentOption !== 'CashPay'){
    //   this.receiverName='';//clear receivers name if diff payment option is selected
    // }
  }
  onNameChange(): void {
    console.log('Receiver Name on change:', this.receiverName);
  }
  
  paymentTo = {
    bank_Account_Name: '',
    bank_Account_Number: '',
    bank_Name: '',
    IFSC: '',
  };
  billTo = {
    name: '',
    phone: '',
    email: '',
  };
  tableTo = {
    Item: ' ',
    Rate: '',
    Disc: '',
    GST: '',
    Amount: '',
  };

  invoiceTo = {
    invoiceNo: '',
    invoiceDate: '',
    dueDate: '',
  };
  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.billingForm = this.fb.group({
      name: [''],
      email: [''],
      phone: ['']
    });
  }

  // Function to convert numbers to words
  numberToWords(num: number): string {
    const ones: string[] = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];

    const tens: string[] = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];

    let word = '';

    if (num === 0) return 'Zero';

    // Handle numbers less than 20
    if (num < 20) {
      word = ones[num];
    } else if (num < 100) {
      word =
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    } else if (num < 1000) {
      word =
        ones[Math.floor(num / 100)] +
        ' Hundred' +
        (num % 100 !== 0 ? ' and ' + this.numberToWords(num % 100) : '');
    } else if (num >= 1000) {
      word =
        this.numberToWords(Math.floor(num / 1000)) +
        ' Thousand' +
        (num % 1000 !== 0 ? ' ' + this.numberToWords(num % 1000) : '');
    }

    return word;
  }
  ngOnInit(): void {
      // Fetch the initial data
      this.customerList = this.dataService.getData();

      // Subscribe to data updates
      this.dataService.data$.subscribe((data) => {
        this.customerList = data;
      });
    // Initialize the form with validation and default values
    this.billingForm = this.fb.group({
      name: [this.billTo.name, Validators.required],
      phone: [this.billTo.phone, Validators.required],
      email: [this.billTo.email, [Validators.email, Validators.required]],
      // payment
      receiverName: ['', Validators.required], // New field for the receiver's name

      // this is another part
      invoiceNo: ['', Validators.required],
      invoiceDate: ['', Validators.required], // New invoice date field
      dueDate: ['', Validators.required], // New due date field

      // this is table data
      Item: new FormControl(null, Validators.required),
      Rate: new FormControl(null, [Validators.required, Validators.min(0)]),
      Disc: new FormControl({ value: null, disabled: false }), // Make it editable
      GST: new FormControl({ value: null, disabled: true }),
      Amount: new FormControl({ value: null, disabled: true }),
      CGST: new FormControl({ value: null, disabled: true }), // CGST field
      IGST: new FormControl({ value: null, disabled: true }), // IGST field


    });
    this.paymentForm = this.fb.group({
      bank_Account_Name: [
        this.paymentTo.bank_Account_Name,
        Validators.required,
      ],
      bank_Account_Number: [
        this.paymentTo.bank_Account_Number,
        Validators.required,
      ],
      bank_Name: [this.paymentTo.bank_Name, Validators.required],
      IFSC: [this.paymentTo.IFSC, Validators.required],
    });

    // Subscribe to value changes on the 'Rate' field and calculate the amount
    this.billingForm.get('Rate')?.valueChanges.subscribe(() => {
      this.calculateAmount();
    });

    // Subscribe to value changes on the 'GST' field and calculate the amount
    this.billingForm.get('GST')?.valueChanges.subscribe(() => {
      this.calculateAmount();
    });

    // Check if an invoice counter exists in localStorage
    const storedInvoiceCounter = localStorage.getItem('invoiceCounter');
    if (storedInvoiceCounter) {
      this.invoiceCounter = Number(storedInvoiceCounter);
    }

    // Generate the next invoice number and set dates
    this.generateInvoiceNumber();
  }

  onPaymentFormSubmit() {
    if (this.paymentForm.valid) {
      console.log('Payment Form Submitted: ', this.paymentForm.value);

      // Use window.bootstrap to access the Modal API
      const modalElement = document.getElementById('paymentModal');
      const modal = new (window as any).bootstrap.Modal(modalElement);

      // Close the modal programmatically after form submission
      modal.hide();
    }
  }

  openPaymentModal() {
    const modalElement = document.getElementById('paymentModal');
    const modal = new (window as any).bootstrap.Modal(modalElement);

    // Open the modal programmatically
    modal.show();
  }

  // Add Payment Schedule
  add(event: Event) {
    event.preventDefault(); // Prevent page reload

    console.log('data ');
    if (this.isFormValid()) {
      // Calculate required fields before adding or updating
      this.calculateTaxDetails(); // Ensure tax values are calculated
      console.log('calculate done');
      this.calculateAmount(); // Ensure total amount is calculated
      console.log('final');

      // Prepare the final payment schedule object with calculated values
      const newSchedule = {
        Item: this.billingForm.get('Item')?.value, // Correctly access form control values
        Rate: this.billingForm.get('Rate')?.value,
        Disc: this.billingForm.get('Disc')?.value,
        GST: this.billingForm.get('GST')?.value,
        Amount: this.billingForm.get('Amount')?.value,
        CGST: this.billingForm.get('CGST')?.value, // Add CGST to schedule
        IGST: this.billingForm.get('IGST')?.value, // Add IGST to schedule
      };

      console.log('end');

      // Add or update payment schedule
      if (this.editIndex1 === -1) {
        // Add new schedule
        this.paymentSchedules1.push(newSchedule);
      } else {
        // Update existing schedule
        this.paymentSchedules1[this.editIndex1] = newSchedule;
      }

      // Manually trigger change detection after updating values
      this.cdr.detectChanges(); // This will update the view with the new CGST value

      // Now reset the form values after adding or updating, but keep certain fields intact
      const currentInvoiceNo = this.billingForm.get('invoiceNo')?.value;
      const currentInvoiceDate = this.billingForm.get('invoiceDate')?.value;
      const currentDueDate = this.billingForm.get('dueDate')?.value;
      const currentName = this.billingForm.get('name')?.value; // Preserve name
      const currentPhone = this.billingForm.get('phone')?.value; // Preserve phone
      const currentEmail = this.billingForm.get('email')?.value; // Preserve email

      // Reset the form and preserve essential fields
      this.billingForm.reset();
      this.billingForm.patchValue({
        invoiceNo: currentInvoiceNo || this.invoiceCounter.toString(), // Preserve or set the invoice number
        invoiceDate:
          currentInvoiceDate || new Date().toLocaleDateString('en-GB'), // Preserve or set the invoice date
        dueDate: currentDueDate || '', // Preserve or set due date if necessary
        name: currentName, // Preserve name
        phone: currentPhone, // Preserve phone
        email: currentEmail, // Preserve email
      });

      this.show = false; // Hide the form after submission
      this.editIndex1 = -1; // Reset the edit index (indicating no edit mode)
    }
  }

  // Calculate Discount, Taxable Value, Tax Amount, CGST, SGST, and Amount
  calculateTaxDetails() {
    const rate = this.billingForm.get('Rate')?.value;
    const discountPercent = this.billingForm.get('Disc')?.value; // Discount entered by the user

    // Check if rate and discount are valid
    if (rate && discountPercent !== undefined) {
      // Calculate Discount only if discount is provided
      const discount = (rate * discountPercent) / 100;

      // Calculate GST (18%) as 9% CGST and 9% IGST
      const totalGST = (rate * 18) / 100;
      const cgst = totalGST / 2; // 9% CGST
      const igst = totalGST / 2; // 9% IGST

      // Set values in the form
      this.billingForm.get('Disc')?.setValue(discount); // Apply the discount
      this.billingForm.get('GST')?.setValue(totalGST); // Set the total GST (18%)
      this.billingForm.get('CGST')?.setValue(cgst); // Set the CGST (9%)
      this.billingForm.get('IGST')?.setValue(igst); // Set the IGST (9%)

      // Enable CGST and IGST fields if they are disabled
      this.billingForm.get('CGST')?.enable();
      this.billingForm.get('IGST')?.enable();
    }
  }

  // Validate the form fields
  isFormValid() {
    return this.billingForm.valid; // Returns true if form is valid
  }

  // Calculate Discount, Taxable Value, Tax Amount, CGST, SGST, and Amount

  // Calculate the Total Amount (Taxable Value + Tax Amount) * Qty
  calculateAmount() {
    const rate = this.billingForm.get('Rate')?.value;
    const discount = this.billingForm.get('Disc')?.value || 0; // Default to 0 if no discount is entered
    const cgst = this.billingForm.get('CGST')?.value || 0; // Get CGST value
    const igst = this.billingForm.get('IGST')?.value || 0; // Get IGST value

    if (rate && (cgst || igst)) {
      // Calculate the amount after discount (if any)
      const amountBeforeTax = rate - discount; // Subtract discount from rate
      const totalAmount = amountBeforeTax + cgst + igst; // Add CGST and IGST to the discounted amount
      this.totalAmount = totalAmount;

      // Update the Amount field in the form
      this.billingForm.get('Amount')?.setValue(totalAmount);
      console.log('Total Amount calculated:', totalAmount);
    }
  }

  validateDiscount(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.discount = parseFloat(input);

    if (this.discount < 0) {
      this.discount = 0;
    } else if (this.discount > 40) {
      this.discount = 40;
      alert('discount is upto 40% not more than that');
    }

    // Recalculate the discounted total
    this.calculateDiscountedTotal();
  }

  // Calculate the discounted total value
  calculateDiscountedTotal(): void {
    this.discountAmount = (this.totalAmount * this.discount) / 100;

    this.discountedTotal = this.totalAmount - this.discountAmount;
  }

  // Reset the form after adding or editing a payment schedule
  resetForm() {
    this.billingForm.reset(); // Reset the form
    this.show = false; // Hide the form after submission
    this.editIndex1 = -1; // Reset the edit index (indicating no edit mode)
    this.billingForm.patchValue({ invoiceNo: this.invoiceCounter.toString() }); // Default invoice number
  }

  // Edit Payment Schedule
  editPaymentSchedule1(index: number) {
    this.editIndex1 = index;

    // Check the data in paymentSchedules1
    console.log('Editing schedule:', this.paymentSchedules1[index]);

    // Set form values to the selected schedule
    this.billingForm.patchValue({
      Item: this.paymentSchedules1[index].Item,
      Rate: this.paymentSchedules1[index].Rate,
      Disc: this.paymentSchedules1[index].Disc,
      GST: this.paymentSchedules1[index].GST,
      Amount: this.paymentSchedules1[index].Amount,
    });

    // Show the form in edit mode
    this.show = true;

    // Recalculate tax details and amount
    this.calculateTaxDetails(); // Ensure tax values are recalculated
    this.calculateAmount(); // Recalculate the total amount
  }

  // Delete Payment Schedule
  deleteit(index: number) {
    if (confirm('Are you sure you want to delete this schedule?')) {
      this.paymentSchedules1.splice(index, 1); // Remove the schedule from the list
    }
  }

  // Generate invoice number and update form
  generateInvoiceNumber() {
    // Increment the invoice number
    this.invoiceCounter++;
  
    // Store the new invoice number in localStorage so it persists
    localStorage.setItem('invoiceCounter', this.invoiceCounter.toString());
  
    // Set the generated invoice number
    this.invoiceTo.invoiceNo = this.invoiceCounter.toString(); // Update the invoiceNo property
    
    const invoiceDate = new Date();
    this.invoiceTo.invoiceDate = invoiceDate.toLocaleDateString('en-GB'); // Set today's date as invoice date
  
    // Set due date to 30 days after invoice date
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30); // Add 30 days to the invoice date
    this.invoiceTo.dueDate = dueDate.toLocaleDateString('en-GB'); // Set due date
  
    // Update the form with these values
    this.billingForm.patchValue({
      invoiceNo: this.invoiceTo.invoiceNo,
      invoiceDate: this.invoiceTo.invoiceDate,
      dueDate: this.invoiceTo.dueDate,
    });
  }
  
  formData: any = { name: '', email: '', phone: '' };
  customerList: any[] = [];
  // Submit form and handle the increment of the invoice number
  onSubmit() {
    if (this.billingForm.valid) {
      // Update the billTo object with form values
      this.billTo = this.billingForm.value;
  
      // Log the data for debugging
      console.log('Bill To data updated:', this.billTo);
  
      // Generate the next invoice number after submitting
      this.generateInvoiceNumber();
  
      // Get form data and add it to the customer list
      const customerData = this.billingForm.value;
      this.modalFormCustomerList.push(customerData);
  debugger;
  
      // Optionally log customer added data (for debugging or backend calls)
      console.log('Customer added:', customerData);
    // Add the form data to the service
    this.dataService.addData(customerData);
      // Disable the Add button to prevent multiple submissions
      this.isAddButtonDisabled = true;
  
      // Close the modal after submission (ensure this is set up in your modal component)
      this.closeModal();
  
    
  
      // Optionally, reset the form after submission
      // this.billingForm.reset();
      
      // Enable the submit button again for future submissions (if desired)
      // this.isAddButtonDisabled = false;
  
      // Optionally show success message or handle UI feedback
      alert('Invoice submitted successfully!');
    } else {
      // Alert or handle the case where the form is invalid
      alert('Please fill in all the required fields!');
    }
  }
  

  // Print the invoice dynamically
  printInvoice() {
    const printContent = document.getElementById('invoiceContent');
    const printWindow = window.open('', '', 'height=600,width=800');

    if (printWindow && printContent) {
      // Get the updated form values dynamically from billingForm
      const {
        name,
        cin,
        gstin,
        address1,
        address2,
        postalcode,
        city,
        state,
        country,
        phone,
        email,
        invoiceNo,
        invoiceDate,
        dueDate,
      } = this.billingForm.value;

      // Generate the print window content dynamically
      printWindow.document.write('<html><head><title>Invoice</title>');
      printWindow.document.write(`
        <style>
          /* Watermark styles */
          body {
            position: relative;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.1; /* Set opacity for watermark effect */
            width: 400px;
            height: 400px;
            background-image: url('/logo-For_Invoice-removebg-preview.png');
            background-repeat: no-repeat;
            background-size: contain;
            z-index: -1; /* Ensure watermark is behind the content */
          }
        </style>
      `);
      printWindow.document.write('</head><body>');

      printWindow.document.write(`
              <div class="watermark"></div> <!-- Watermark div -->

      <div style="display: flex; width: 100%; justify-content: space-between; margin: 0;">
        <h3 style="color: orange; text-align: left; margin: 0; margin-left: 10px;">TAX INVOICE</h3>
        <h6 style="text-align: right; margin: 0; margin-right: 10px;">ORIGINAL FOR RECIPIENT</h6>
      </div>

      <div style="display: flex; width: 100%;">
        <div style="flex: 8; padding-right: 10px; padding-left: 10px; display: flex; flex-direction: column; align-items: flex-start;">
          <h3 style="margin: 0;">DEZYKODE IT SOLUTION PRIVATE LIMITED</h3>
          <h4 style="margin: 0;">GSTIN 27AAKCD0617P1ZB PAN AAKCD0617P</h4>
          <div style="margin: 0;">
              <p style="margin: 0;">Survey No.53,54, Second Floor, City Vista, Building A - 08</p>
              <p style="margin: 0;">Fountain Road, Pune</p>
              <p style="margin: 0;">MAHARASHTRA, 411014</p>
              <p style="margin: 0;"><strong>Mobile:</strong> +91 8793938874, 9730822219 <strong> Email:</strong> dezykode@gmail.com</p>
              <p style="margin: 0;"><strong>Website:</strong> www.dezykode.com</p>
          </div>
        </div>
        <div style="flex: 4;">
          <img src="https://dezykode.com/assets/img/logo/Dk.svg" 
               alt="Dezykode IT Solutions" style="width: 100%; height: 100px; object-fit: cover; margin-right:20px">
        </div>
      </div>

      <div style="display: flex; width: 100%; justify-content: space-between; ">
    <div style=" width: 30%;  padding-left: 10px;padding-right: 10px">
        <p><strong>Invoice No:</strong> ${invoiceNo || 'N/A'}<br /></p>
    </div>
    <div style="width: 30%;  padding-left: 10px;padding-right: 10px">
        <p><strong>Invoice Date:</strong> ${invoiceDate || 'N/A'}<br /></p>
    </div>
    <div style="width: 30%;   padding-left: 10px;padding-right: 10px">
        <p><strong>Due Date:</strong> ${dueDate || 'N/A'}<br /></p>
    </div>
</div>

<div style="display: flex; width: 100%; justify-content: space-between; ">
    <div style=" width: 30%; padding-left: 10px;padding-right: 10px">
        <p ><strong>Customer Details:</strong><br />
        ${name}<br/>
        ${phone}<br/>
        ${email}</p>
    </div>
    <div style="width: 30%;  padding-left: 10px;padding-right: 10px">
        <p><strong>Billing Address:</strong><br />
        OFFICE NUMBER -08, 2ND FLOOR, CITY<br />
        VISTA -A WING,<br />
        DOWNTOWN ROAD KHARADI<br />
        Pune City East, MAHARASHTRA, 411014</p>
    </div>
    <div style="width: 30%;  padding-left: 10px;padding-right: 10px">
    </div>
</div>


<div style="display: flex; width: 100%; justify-content: space-between;">
    <div style=" width: 30%;  padding-left: 10px;padding-right: 10px">
         <p><strong>Place of Supply:</strong><br />
       <strong>27-MAHARASHTRA</strong><br />
      </p>
    </div>
    <div style="width: 30%;  padding-left: 10px;padding-right: 10px">
    
    </div>
    <div style="width: 30%; padding-left: 10px;padding-right: 10px">
    </div>
</div>

    <div style="overflow-x:auto;">
  <table style="width: 100%; border: 1px solid orange;text-align: left; margin-left: 20px 0; margin-right: 20px 0;">
    <thead style="background-color: #f8f9fa;">
      <tr>
        <th style=" padding: 10px;">#</th>
        <th style=" padding: 10px;">Item</th>
        <th style=" padding: 10px;">Rate/Item</th>
        <th style=" padding: 10px;">GST (18%)</th>
         <th style=" padding: 10px;">Amount </th>

      </tr>
    </thead>
    <tbody>
      <!-- Display added payment schedules -->
      ${this.paymentSchedules1
        .map(
          (schedule, index) => `
              <tr>
                <td style="border: 1px solid #dee2e6; padding: 10px;">${
                  index + 1
                }</td>
                <td style="border: 1px solid #dee2e6; padding: 10px;">${
                  schedule.Item
                }</td>
                <td style="border: 1px solid #dee2e6; padding: 10px;">${
                  schedule.Rate
                }</td>
                <td style="border: 1px solid #dee2e6; padding: 10px;">${
                  schedule.GST
                }</td>
                <td style="border: 1px solid #dee2e6; padding: 10px;">${
                  schedule.Amount
                }</td>
              </tr>
            `
        )
        .join('')}      
    </tbody>
  </table>
</div>
<div>
  <div class="p-2 mona padding rounded text-start justify-content-between align-items-center"
       style="padding: 10px; border-radius: 8px; display: flex; justify-content: flex-end; align-items: center; text-align: right;">
    <div class="text-dark" style="color: #343a40;">
      <!-- Taxable Amount -->
      <strong>Taxable Amount</strong>
      <strong class="px-5" style="padding-left: 20px; padding-right: 20px;">₹ ${
        this.totalAmount
      }</strong>
      <br />

      <!-- CGST -->
      <strong>CGST 9.0%</strong>
      <strong class="px-5" style="padding-left: 20px; padding-right: 20px;">₹ ${
        this.billingForm.get('CGST')?.value
      }</strong>
      <br />

      <!-- IGST -->
      <strong>IGST 9.0%</strong>
      <strong class="px-5" style="padding-left: 20px; padding-right: 20px;">₹ ${
        this.billingForm.get('IGST')?.value
      }</strong>
      <br />

      <!-- Horizontal line -->
      <hr class="my-0" style="color: orange; border: 1px solid; margin-top: 0; margin-bottom: 0;" />

      <!-- Total -->
      <strong>TOTAL</strong>
      <strong class="px-5" style="padding-left: 20px; padding-right: 20px;">₹ ${
        this.totalAmount
      }</strong>
      <br />

      <!-- Horizontal line (styled) -->
      <hr class="my-0" style="color: orange; border: 1px solid; margin-top: 0; margin-bottom: 0;" />

      <!-- Amount Payable -->
      <strong>Amount Payable</strong>
      <strong class="px-5" style="padding-left: 20px; padding-right: 20px;">₹ ${
        this.totalAmount
      }</strong>
      <br />
         <strong>Discount in Value </strong>
              <strong class="px-5" style="padding-left: 20px; padding-right: 20px;"> ₹ ${
                this.discountAmount
              }
              </strong>
              <br />
              <strong>Discount in Percentage</strong>
              <strong class="px-5 " style="padding-left: 20px; padding-right: 20px;">  ₹ ${
                this.discount
              }%
              </strong>
              <br />
      <!-- Discounted Amount -->
      <strong>Amount Payable after Discount</strong>
      <strong class="px-5" style="padding-left: 20px; padding-right: 20px;">₹ ${
        this.discountedTotal
      }</strong><br />
          <strong>Discounted Total in Words: </strong>

              <span class="px-5" > ${this.numberToWords(
                this.discountedTotal
              )}  only </span>

            <hr class="my-0" style="color: orange; border: 1px solid; margin-top: 0; margin-bottom: 0;" />

    </div>
  </div>
</div>


<div class="row p-2" style="display: flex; padding: 10px;">
  <div class="col-md-5" style="flex: 1;">
    <div>
      <div class="text-start text-dark" style="color: #343a40;">
        <div style="padding: 10px;">
          <strong>Bank Details:</strong><br />
          <span>Bank :</span>
          <strong class="px-5" style="padding-left: 5px; padding-right: 5px;"> AU Small Finance Bank </strong><br />
          <span>Account # :</span>
          <strong class="px-2" style="padding-left: 2px; padding-right: 2px;"> 2502261664479692 </strong><br />
          <span> IFSC Code :</span>
          <strong class="px-2" style="padding-left: 2px; padding-right: 2px;"> AUBLOOO2612 </strong> <br />
          <span style="padding-right: 7px;"> Branch :</span>
          <strong class="px-4" style="padding-left: 4px; padding-right: 4px;"> PUNE </strong>
        </div>
      </div>
    </div>
  </div>
  <!--  -->
  <div class="col-md-7" style="flex: 1;">
        <!-- Payment Section Based on paymentOption -->
      <div>
        <div class="text-start text-dark" style="color: #343a40;">
          <div style="padding: 10px;">
            <strong>Amount Payable after Discount</strong>
            <strong class="px-5" style="padding-left: 5px; padding-right: 5px;">
              ₹${this.discountedTotal}
            </strong>
            <br />
            ${this.paymentOption === 'full'?`
            <div>
              <strong>Full Payment:</strong>
              <i>Payment of ₹${this.amountToPay} completed successfully via ${this.selectedPaymentOption} Receiver:${this.receiverName}</i>
            </div>
              `:''}
            
            ${this.paymentOption === '2' ? `
              <div>
                <strong>Remaining Amount: </strong> ₹${this.discountedTotal - this.amountToPay}
                <br />
                <strong>Installment 1: </strong> ₹${(this.discountedTotal) / 2}
                <span *ngIf="installmentStatus.installment1 === 'paid'">
                  (Paid on ${this.installmentDates.installment1}  ${this.selectedPaymentOption})
                </span>
                <span *ngIf="installmentStatus.installment1 === 'pending'">
                  (${this.installmentStatus.installment1})
                </span>
                <br />
                <strong>Installment 2: </strong> ₹${(this.discountedTotal) / 2}
                <span *ngIf="installmentStatus.installment2 === 'paid'">
                  (Paid on ${this.installmentDates.installment2})
                </span>
                <span *ngIf="installmentStatus.installment2 === 'pending'">
                  (${this.installmentStatus.installment2})
                </span>
                <br />
              </div>
            ` : ''}

            ${this.paymentOption === '3' ? `
              <div>
                <strong>Remaining Amount: </strong> ₹${this.discountedTotal - this.amountToPay}
                <br />
                <strong>Installment 1: </strong> ₹${(this.discountedTotal) / 3}
                <span *ngIf="installmentStatus.installment1 === 'paid'">
                  (Paid on ${this.installmentDates.installment1})
                </span>
                <span *ngIf="installmentStatus.installment1 === 'pending'">
                  (${this.installmentStatus.installment1})
                </span>
                <br />
                <strong>Installment 2: </strong> ₹${(this.discountedTotal) / 3}
                <span *ngIf="installmentStatus.installment2 === 'paid'">
                  (Paid on  ${this.installmentDates.installment2})
                </span>
                <span *ngIf="installmentStatus.installment2 === 'pending'">
                  (${this.installmentStatus.installment2})
                </span>
                <br />
                <strong>Installment 3: </strong> ₹${(this.discountedTotal) / 3}
                <span *ngIf="installmentStatus.installment3 === 'paid'">
                  (Paid on ${this.installmentDates.installment3})
                </span>
                <span *ngIf="installmentStatus.installment3 === 'pending'">
                  (${this.installmentStatus.installment3})
                </span>
                <br />
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      `);
          


          

    
      
   

   

      printWindow.document.write('</body></html>');

      printWindow.document.close(); // Close the document for printing

      // Ensure that the image is loaded before printing
      printWindow.onload = function () {
        printWindow.print(); // Trigger the print after everything is loaded
      };
    } else {
      console.error('Failed to open print window.');
    }
  }
  
// Assuming you have a method to handle the payment option selection
handlePaymentOptionSelection(selectedOption: string) {
  this.paymentOption = selectedOption; // Save the selected installment option
}
onCancel(): void {
  // Reset form fields and close modal
  // this.billingForm.reset();
  // this.closeModal();
}
  // Open the modal
  openModal() {
    const modalElement = document.getElementById('billToModal');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
    this.isModalOpen = true;

    // Prefill form values if you already have billTo data
    this.billingForm.patchValue(this.billTo);
  }
  isModalFormValid(): boolean {
    return (
      this.billingForm.controls['name'].valid &&
      this.billingForm.controls['phone'].valid &&
      this.billingForm.controls['email'].valid
    );
  }
  // Close the modal
  closeModal() {
    const modalElement = document.getElementById('billToModal');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.hide();
    this.isModalOpen = false;
  }

  // Prevent form submission when Enter key is pressed
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key
    }
  }
}

function toWords(amount: number) {
  throw new Error('Function not implemented.');
}



  

