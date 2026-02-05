import { ProductToCreateType, ProductToUpdateType } from '../../schemas/Product.schema';
import { PublicProduct, ProductFiltersForService, ListOfProducts } from '../../types/dtos/Product.dto';

export default interface IProductService {
    createProduct(data: ProductToCreateType): Promise<PublicProduct>;
    getProductById(id: string): Promise<PublicProduct>;
    getListOfProducts(filters: ProductFiltersForService): Promise<ListOfProducts>;
    updateProduct(id: string, data: ProductToUpdateType): Promise<PublicProduct>;
    deleteProduct(id: string): Promise<void>;
}
