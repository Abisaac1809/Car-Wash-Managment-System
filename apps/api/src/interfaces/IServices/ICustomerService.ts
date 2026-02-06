import { CustomerToCreateType, CustomerToUpdateType, ListOfCustomers, PublicCustomer, CustomerFiltersType } from "../../types/dtos/Customer.dto";

export default interface ICustomerService {
    create(data: CustomerToCreateType): Promise<PublicCustomer>;
    update(id: string, data: CustomerToUpdateType): Promise<PublicCustomer>;
    getById(id: string): Promise<PublicCustomer>;
    getAll(filters: CustomerFiltersType): Promise<ListOfCustomers>;
    delete(id: string): Promise<void>;
}
