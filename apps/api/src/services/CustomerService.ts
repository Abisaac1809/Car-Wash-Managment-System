import ICustomerService from "../interfaces/IServices/ICustomerService";
import { ICustomerRepository } from "../interfaces/IRepositories/ICustomerRepository";
import { CustomerToCreateType, CustomerToUpdateType, CustomerFiltersType, ListOfCustomers, PublicCustomer } from "../types/dtos/Customer.dto";
import { CustomerAlreadyExistsError, CustomerNotFoundError } from "../errors/BusinessErrors";
import CustomerMapper from "../mappers/CustomerMapper";

export default class CustomerService implements ICustomerService {
    constructor(private customerRepository: ICustomerRepository) { }

    async create(data: CustomerToCreateType): Promise<PublicCustomer> {
        if (data.idNumber) {
            const existing = await this.customerRepository.getByIdNumber(data.idNumber, true);

            if (existing) {
                if (existing.deletedAt !== null && existing.deletedAt !== undefined) {
                    await this.customerRepository.restore(existing.id);
                    const updated = await this.customerRepository.update(existing.id, data);
                    return CustomerMapper.toPublic(updated);
                }

                throw new CustomerAlreadyExistsError(
                    `Customer with ID number "${data.idNumber}" already exists`
                );
            }
        }

        const newCustomer = await this.customerRepository.create(data);
        return CustomerMapper.toPublic(newCustomer);
    }

    async update(id: string, data: CustomerToUpdateType): Promise<PublicCustomer> {
        const customer = await this.customerRepository.getById(id);
        if (!customer) {
            throw new CustomerNotFoundError(`Customer with ID ${id} not found`);
        }

        if (data.idNumber && data.idNumber !== customer.idNumber) {
            const existing = await this.customerRepository.getByIdNumber(data.idNumber, true);
            if (existing && existing.id !== id) {
                throw new CustomerAlreadyExistsError(
                    `Customer with ID number "${data.idNumber}" already exists`
                );
            }
        }

        const updated = await this.customerRepository.update(id, data);
        return CustomerMapper.toPublic(updated);
    }

    async getById(id: string): Promise<PublicCustomer> {
        const customer = await this.customerRepository.getById(id);
        if (!customer) {
            throw new CustomerNotFoundError(`Customer with ID ${id} not found`);
        }

        return CustomerMapper.toPublic(customer);
    }

    async getAll(filters: CustomerFiltersType): Promise<ListOfCustomers> {
        const offset = (filters.page - 1) * filters.limit;

        const [customers, totalRecords] = await Promise.all([
            this.customerRepository.getList({
                search: filters.search,
                idNumber: filters.idNumber,
                limit: filters.limit,
                offset,
            }),
            this.customerRepository.count({
                search: filters.search,
                idNumber: filters.idNumber,
            }),
        ]);

        const totalPages = Math.ceil(totalRecords / filters.limit);

        return {
            data: CustomerMapper.toPublicList(customers),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }

    async delete(id: string): Promise<void> {
        const existing = await this.customerRepository.getById(id);
        if (!existing) {
            throw new CustomerNotFoundError(`Customer with ID ${id} not found`);
        }

        await this.customerRepository.softDelete(id);
    }
}
