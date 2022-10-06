var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { msg, localized } from '@lit/localize';
let XGreeter = class XGreeter extends LitElement {
    render() {
        return html `<p>${msg(html `Hello <b>World</b>!`)}</p>`;
    }
};
XGreeter = __decorate([
    localized(),
    customElement('x-greeter')
], XGreeter);
export { XGreeter };
//# sourceMappingURL=x-greeter.js.map