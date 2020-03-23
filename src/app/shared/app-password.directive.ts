import { Directive, ElementRef } from '@angular/core';
@Directive({
  selector: '[apppassword]'
})
export class AppPasswordDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.setAttribute('type', 'password');
  }
}