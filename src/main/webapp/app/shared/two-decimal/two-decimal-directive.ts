import { HostListener, Directive, ElementRef } from '@angular/core';

@Directive({
  exportAs: '[jhiTwoDecimal]',
  selector: '[jhiTwoDecimal]',
})
export class TwoDecimalDirective {
  private regex = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    const current = this.el.nativeElement.value;
    const next = current.concat(event.key);

    if (next && !this.regex[Symbol.match](String(next))) {
      event.preventDefault();
    }
  }
}
