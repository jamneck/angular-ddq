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
  detailForm;

  partNameOptions: string[];
  filteredPartNameOptions: Observable<string[]>[] = [];

  labourNameOptions: string[] = ['Change oil', 'Replace filter', 'Service'];
  filteredLabourNameOptions: Observable<string[]>[] = [];

  constructor(
    private fb: FormBuilder,
    private partsService: PartsService
  ) { }

  get parts() {
    return this.detailForm.get('parts') as FormArray;
  }

  get labour() {
    return this.detailForm.get('labour') as FormArray;
  }

  ngOnInit() {
    this.getParts();
    this.initForm();
  }

  initForm() {
    this.detailForm = this.fb.group({
      parts: this.fb.array([
        this.partForm()
      ]),
      labour: this.fb.array([
        this.labourForm()
      ]),
      consumablesCost: null,
      expiryDate: '',  // auto one month ahead (14 or 30 days)
      comments: ''
    })

    this.filteredPartNameOptions.push(this.partNameChanges());
    this.filteredLabourNameOptions.push(this.labourNameChanges());
  }

  partForm() {
    return this.fb.group({
      name: '',
      unitCost: null,
      quantity: 1
    });
  }

  labourForm() {
    return this.fb.group({
      name: '',
      duration: null,
      hourlyCost: null,
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

  get totalCost() {
    const sumParts = this.parts.controls
      .map(e => e.get('unitCost').value * e.get('quantity').value)
      .reduce((prev, curr) => prev + curr, 0);
    
    const sumLabour = this.labour.controls
      .map(e => e.get('hourlyCost').value * e.get('duration').value)
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
  }

  addLabour() {
    this.labour.push(this.labourForm());
    this.filteredLabourNameOptions.push(this.labourNameChanges());
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    alert(JSON.stringify(this.detailForm.value));
  }

  getParts() {
    this.partsService.getParts()
      .subscribe(result => this.partNameOptions = result['parts'])
  }

  partItemTotal(i: number) {
    const item = this.parts.controls[i].value;
    return item.quantity * item.unitCost
  }

  labourItemTotal(i: number) {
    const item = this.labour.controls[i].value;
    return item.duration * item.hourlyCost
  }

  removePart(i: number) {
    this.filteredPartNameOptions.splice(i, 1);
    this.parts.removeAt(i);
  }

  removeLabour(i: number) {
    this.filteredLabourNameOptions.splice(i, 1);
    this.labour.removeAt(i);
  }
}
