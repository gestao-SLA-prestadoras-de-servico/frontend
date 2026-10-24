import { Component } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-product-preview',
  imports: [Icon],
  templateUrl: './product-preview.html',
  host: { class: 'block min-w-0' },
})
export class ProductPreview {}
