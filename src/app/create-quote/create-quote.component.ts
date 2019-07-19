import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {PartsService} from '../parts.service';

/**
 * @title Filter autocomplete
 */
@Component({
  selector: 'app-create-quote',
  templateUrl: './create-quote.component.html',
  styleUrls: ['./create-quote.component.css']
})
export class CreateQuoteComponent implements OnInit {
  quoteForm;

  partNameOptions: string[];
  filteredPartNameOptions: Observable<string[]>[] = [];

  labourNameOptions: string[] = ['Change oil', 'Replace filter', 'Service'];
  filteredLabourNameOptions: Observable<string[]>[] = [];

  constructor(
    private fb: FormBuilder,
    private partsService: PartsService
  ) { }

  get parts() {
    return this.quoteForm.get('parts') as FormArray;
  }

  get labour() {
    return this.quoteForm.get('labour') as FormArray;
  }

  // get consumables() {
  //   return this.quoteForm.get('consumables') as FormArray;
  // }

  // get other() {
  //   return this.quoteForm.get('other') as FormArray;
  // }

  ngOnInit() {
    this.getParts();
    this.initForm();
  }

  initForm() {
    this.quoteForm = this.fb.group({
      parts: this.fb.array([]),
      labour: this.fb.array([]),
      consumables: this.fb.array([]),
      other: this.fb.array([]),
    })
  }

  partForm() {
    return this.fb.group({
      name: '',
      uid: '',
      unit_cost: null,
      quantity: 1
    });
  }

  labourForm() {
    return this.fb.group({
      name: '',
      uid: '',
      duration: null,
      hourly_cost: null,
    });
  }

  consumableForm() {
    return this.fb.group({
      name: '',
      uid: '',
      quantity: '',
      cost: ''
    });
  }

  otherForm() {
    return this.fb.group({
      name: '',
      uid: '',
      quantity: '',
      cost: ''
    });
  }

  partNameChanges() {
    return this.parts.controls[this.parts.length - 1].get('name').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.partNameOptions))
      )
  }

  labourNameChanges() {
    return this.labour.controls[this.labour.length - 1].get('name').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.labourNameOptions))
      )
  }

  // partCostChanges() {
  //   return this.parts.controls[this.parts.length - 1].get('cost').valueChanges
  //     .subscribe(() => this.updateTotalCost())
  // }

  // labourCostChanges() {
  //   return this.labour.controls[this.labour.length - 1].get('cost').valueChanges
  //     .subscribe(() => this.updateTotalCost())
  // }

  // updateTotalCost() {
  //   const sumParts = this.parts.controls
  //     .map(e => e.get('cost').value)
  //     .reduce((prev, curr) => prev + curr, 0);
    
  //   const sumLabour = this.labour.controls
  //     .map(e => e.get('cost').value)
  //     .reduce((prev, curr) => prev + curr, 0);
    
  //   this.quoteForm.patchValue(
  //     {cost: sumParts + sumLabour}
  //   )
  // }

  get totalCost() {
    const sumParts = this.parts.controls
      .map(e => e.get('unit_cost').value * e.get('quantity').value)
      .reduce((prev, curr) => prev + curr, 0);
    
    const sumLabour = this.labour.controls
      .map(e => e.get('hourly_cost').value * e.get('duration').value)
      .reduce((prev, curr) => prev + curr, 0);
    
    return sumParts + sumLabour
  }

  private _filter(value: string, options: string[] = []): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addPart() {
    this.parts.push(this.partForm());
    this.filteredPartNameOptions.push(this.partNameChanges());
    // this.partCostChanges();
  }

  addLabour() {
    this.labour.push(this.labourForm());
    this.filteredLabourNameOptions.push(this.labourNameChanges());
    // this.labourCostChanges();
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    alert(JSON.stringify(this.quoteForm.value));
  }

  getParts() {
    this.partsService.getParts()
      .subscribe(result => this.partNameOptions = result['parts'])
  }

  partItemTotal(i: number) {
    const item = this.parts.controls[i].value;
    return item.quantity * item.unit_cost
  }

  labourItemTotal(i: number) {
    const item = this.labour.controls[i].value;
    return item.duration * item.hourly_cost
  }
}
