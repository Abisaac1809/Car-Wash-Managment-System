import Customer from "../entities/Customer";
import { PublicCustomer } from "../types/dtos/Customer.dto";

export default class CustomerMapper {
    static toPublic(customer: Customer): PublicCustomer {
        return {
            id: customer.id,
            fullName: customer.fullName,
            idNumber: customer.idNumber,
            phone: customer.phone,
        };
    }

    static toPublicList(customers: Customer[]): PublicCustomer[] {
        return customers.map(CustomerMapper.toPublic);
    }
}
