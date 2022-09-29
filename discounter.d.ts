/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement } from 'lit';
/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class DiscounterForm extends LitElement {
    static styles: import("lit").CSSResult;
    private data;
    private hide;
    private error;
    private loading;
    private disabled;
    private code;
    private dataFetcher;
    handleInput(event: InputEvent): void;
    private applyCode;
    private getDiscountsAndGifts;
    render(): "" | import("lit-html").TemplateResult<1>;
}
export declare class DiscounterSummary extends LitElement {
    private dataFetcher;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'discounter-form': DiscounterForm;
    }
}
//# sourceMappingURL=discounter.d.ts.map