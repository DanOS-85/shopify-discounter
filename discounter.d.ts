/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { LitElement } from 'lit';
import { GiftCard } from './data-controller';
/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class DiscounterForm extends LitElement {
    static styles: import("lit").CSSResult;
    private emptyMsg;
    private error;
    private loading;
    private code;
    private dataFetcher;
    updated(): void;
    handleInput(event: InputEvent): void;
    showTooltip(event: MouseEvent): void;
    hideTooltip(event: MouseEvent): void;
    clearDiscount(event: Event, code: string): Promise<void>;
    clearGiftCard(event: Event, giftCard: GiftCard): Promise<void>;
    private applyCode;
    private getDiscountsAndGifts;
    render(): import("lit-html").TemplateResult<1>;
}
export declare class DiscounterSummary extends LitElement {
    static styles: import("lit").CSSResult;
    constructor();
    private _getDiscounts;
    private _getGiftCards;
    private _formatMoney;
    private dataFetcher;
    private data;
    render(): "" | import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'discounter-form': DiscounterForm;
    }
}
//# sourceMappingURL=discounter.d.ts.map