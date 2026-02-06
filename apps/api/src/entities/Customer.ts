import { CustomerType } from "../types/dtos/Customer.dto";

export default class Customer {
    public readonly id: string;
    public fullName: string;
    public idNumber: string | null;
    public phone: string | null;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: CustomerType) {
        this.id = data.id;
        this.fullName = data.fullName;
        this.idNumber = data.idNumber;
        this.phone = data.phone;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}
