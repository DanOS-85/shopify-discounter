import { ReactiveController, ReactiveControllerHost } from 'lit';
export interface GiftCard {
    "id": number;
    "last_characters": string;
    "balance": string;
    "amount_used": string;
    "presentment_amount_used": string;
}
interface CheckoutData {
    checkout: {
        applied_discounts: Array<{
            title: string;
        }>;
        gift_cards: Array<GiftCard>;
    };
}
export declare class DataController implements ReactiveController {
    private host;
    private _store;
    _token: string;
    _authorizationToken: string;
    _data: CheckoutData;
    _error: boolean;
    constructor(host: ReactiveControllerHost, store: string);
    private getTokens;
    queryCheckout(method?: string, body?: string | null): Promise<Response>;
    private discountQuery;
    hostConnected(): Promise<void>;
}
export {};
//# sourceMappingURL=data-controler.d.ts.map