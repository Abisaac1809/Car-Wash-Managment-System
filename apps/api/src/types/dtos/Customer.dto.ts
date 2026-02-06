import { CustomerToCreateType, CustomerToUpdateType, CustomerFiltersType } from "../../schemas/Customer.schema";

export interface CustomerType {
    id: string;
    fullName: string;
    idNumber: string | null;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null | undefined;
}

export interface PublicCustomer {
    id: string;
    fullName: string;
    idNumber: string | null;
    phone: string | null;
}

export { CustomerToCreateType, CustomerToUpdateType, CustomerFiltersType };

export type CustomerFiltersForRepository = {
    search?: string;
    idNumber?: string;
    limit: number;
    offset: number;
};

export type CustomerFiltersForCount = {
    search?: string;
    idNumber?: string;
};

export type ListOfCustomers = {
    data: PublicCustomer[];
    meta: {
        totalRecords: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    };
};