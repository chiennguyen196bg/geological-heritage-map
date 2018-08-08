import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { GMapModule } from 'primeng/gmap';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { DataTableModule } from 'primeng/datatable';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';

const NG_MODULE = [
  MenubarModule,
  ButtonModule,
  GMapModule,
  PanelModule,
  CardModule,
  SidebarModule,
  InputTextModule,
  AccordionModule,
  DataTableModule,
  AutoCompleteModule,
  MultiSelectModule,
  DropdownModule,
  CheckboxModule,
  DialogModule
];
@NgModule({
  imports: [...NG_MODULE],
  exports: [...NG_MODULE],
  declarations: []
})
export class NgprimeModule { }
