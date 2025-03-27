import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any[]>([]); // Holds the current data
  data$ = this.dataSubject.asObservable(); // Observable to subscribe to
  
  constructor() { }

  // Method to add new data
  addData(newData: any): void {
    const currentData = this.dataSubject.value;
    this.dataSubject.next([...currentData, newData]);  // Push the new data to the array
  }
  

  // Method to update existing data
  updateData(updatedData: any): void {
    const currentData = this.dataSubject.value;
    const index = currentData.findIndex(item => item.id === updatedData.id);  // Assuming each item has an 'id'
    
    if (index !== -1) {
      currentData[index] = updatedData;  // Update the item at the found index
      this.dataSubject.next([...currentData]);  // Emit the updated data
    }
  }

  // Method to delete data
  deleteData(id: any): void {
    const currentData = this.dataSubject.value;
    const filteredData = currentData.filter(item => item.id !== id);  // Filter out the item by id
    this.dataSubject.next(filteredData);  // Emit the updated list
  }

  // Method to fetch current data (optional)
  getData(): any[] {
    return this.dataSubject.value;
  }
}
