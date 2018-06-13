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


@NgModule({
  imports: [
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
    MultiSelectModule
  ],
  exports: [
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
    MultiSelectModule
  ],
  declarations: []
})
export class NgprimeModule { }
