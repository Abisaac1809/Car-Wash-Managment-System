import { Currency } from "../enums";
import { PaymentMethodToCreateType, PaymentMethodToUpdateType, PaymentMethodFiltersType } from '../../schemas/PaymentMethod.schema';

export type { PaymentMethodToCreateType, PaymentMethodToUpdateType, PaymentMethodFiltersType };

export interface PaymentMethodType {
    id: string;
    name: string;
    description: string | null;
    currency: Currency | null;
    bankName: string | null;
    accountHolder: string | null;
    accountNumber: string | null;
    idCard: string | null;
    phoneNumber: string | null;
    email: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null | undefined;
}

export interface PublicPaymentMethod {
    id: string;
    name: string;
    description: string | null;
    currency: Currency | null;
    bankName: string | null;
    accountHolder: string | null;
    accountNumber: string | null;
    idCard: string | null;
    phoneNumber: string | null;
    email: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type PaymentMethodFiltersForService = PaymentMethodFiltersType;

export type PaymentMethodFiltersForRepository = {
    search?: string;
    currency?: Currency;
    isActive?: boolean;
    limit: number;
    offset: number;
};

export type PaymentMethodFiltersForCount = {
    search?: string;
    currency?: Currency;
    isActive?: boolean;
};

export type ListOfPaymentMethods = {
    data: PublicPaymentMethod[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};
