import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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

  partNameOptions: string[] = ['Oil filter', 'Oil', 'Brake pads'];
  filteredPartNameOptions: Observable<string[]>[] = [];

  labourNameOptions: string[] = ['Change oil', 'Replace filter', 'Service'];
  filteredLabourNameOptions: Observable<string[]>[] = [];

  constructor(
    private fb: FormBuilder,
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
    this.initForm();
  }

  initForm() {
    this.quoteForm = this.fb.group({
      cost: [null, Validators.required],
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
      quantity: '',
      cost: ''
    });
  }

  labourForm() {
    return this.fb.group({
      name: '',
      uid: '',
      duration: '',
      cost: '',
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

  partCostChanges() {
    return this.parts.controls[this.parts.length - 1].get('cost').valueChanges
      .subscribe(() => this.updateTotalCost())
  }

  labourCostChanges() {
    return this.labour.controls[this.labour.length - 1].get('cost').valueChanges
      .subscribe(() => this.updateTotalCost())
  }

  updateTotalCost() {
    const sumParts = this.parts.controls
      .map(e => e.get('cost').value)
      .reduce((prev, curr) => prev + curr, 0);
    
    const sumLabour = this.labour.controls
      .map(e => e.get('cost').value)
      .reduce((prev, curr) => prev + curr, 0);
    
    this.quoteForm.patchValue(
      {cost: sumParts + sumLabour}
    )
  }

  private _filter(value: string, options: string[] = []): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addPart() {
    this.parts.push(this.partForm());
    this.filteredPartNameOptions.push(this.partNameChanges());
    this.partCostChanges();
  }

  addLabour() {
    this.labour.push(this.labourForm());
    this.filteredLabourNameOptions.push(this.labourNameChanges());
    this.labourCostChanges();
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    alert(JSON.stringify(this.quoteForm.value));
  }
}
