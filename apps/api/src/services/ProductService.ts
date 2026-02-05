import IProductService from '../interfaces/IServices/IProductService';
import IProductRepository from '../interfaces/IRepositories/IProductRepository';
import ICategoryRepository from '../interfaces/IRepositories/ICategoryRepository';
import { ProductToCreateType, ProductToUpdateType } from '../schemas/Product.schema';
import {
    ProductFiltersForService,
    ListOfProducts,
    PublicProduct,
} from '../types/dtos/Product.dto';
import {
    ProductAlreadyExistsError,
    ProductNotFoundError,
    CategoryNotFoundError,
} from '../errors/BusinessErrors';
import Product from '../entities/Product';
import ProductMapper from '../mappers/ProductMapper';

export default class ProductService implements IProductService {
    constructor(
        private productRepository: IProductRepository,
        private categoryRepository: ICategoryRepository
    ) {}
    
    async createProduct(data: ProductToCreateType): Promise<PublicProduct> {
        if (data.categoryId) {
            const category = await this.categoryRepository.getCategoryById(data.categoryId);
            if (!category) {
                throw new CategoryNotFoundError(`Category with ID ${data.categoryId} not found`);
            }
        }
        
        const existing = await this.productRepository.getByName(data.name);
        
        if (existing) {
            if (existing.deletedAt !== null) {
                await this.productRepository.restore(existing.id);
                const updated = await this.productRepository.update(existing.id, {
                    categoryId: data.categoryId,
                    name: data.name,
                    minStock: data.minStock,
                    unitType: data.unitType,
                    costPrice: data.costPrice,
                    isForSale: data.isForSale,
                    status: data.status,
                });
                return ProductMapper.toPublicProduct(updated);
            }
            
            throw new ProductAlreadyExistsError(`Product with name "${data.name}" already exists`);
        }
        
        const created = await this.productRepository.create(data);
        return ProductMapper.toPublicProduct(created);
    }
    
    async getProductById(id: string): Promise<PublicProduct> {
        const product = await this.productRepository.get(id);
        if (!product) {
            throw new ProductNotFoundError(`Product with ID ${id} not found`);
        }
        return ProductMapper.toPublicProduct(product);
    }
    
    async getListOfProducts(filters: ProductFiltersForService): Promise<ListOfProducts> {
        const offset = (filters.page - 1) * filters.limit;
        
        const [products, totalRecords] = await Promise.all([
            this.productRepository.list({
                search: filters.search,
                categoryId: filters.categoryId,
                isForSale: filters.isForSale,
                status: filters.status,
                lowStock: filters.lowStock,
                limit: filters.limit,
                offset,
            }),
            this.productRepository.count({
                search: filters.search,
                categoryId: filters.categoryId,
                isForSale: filters.isForSale,
                status: filters.status,
                lowStock: filters.lowStock,
            }),
        ]);
        
        const totalPages = Math.ceil(totalRecords / filters.limit);
        
        return {
            data: products.map(p => ProductMapper.toPublicProduct(p)),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }
    
    async updateProduct(id: string, data: ProductToUpdateType): Promise<PublicProduct> {
        const product = await this.productRepository.get(id);
        if (!product) {
            throw new ProductNotFoundError(`Product with ID ${id} not found`);
        }
        
        if (data.categoryId && data.categoryId !== product.categoryId) {
            const category = await this.categoryRepository.getCategoryById(data.categoryId);
            if (!category) {
                throw new CategoryNotFoundError(`Category with ID ${data.categoryId} not found`);
            }
        }
        
        if (data.name && data.name !== product.name) {
            const existing = await this.productRepository.getByName(data.name);
            if (existing && existing.id !== id) {
                throw new ProductAlreadyExistsError(`Product with name "${data.name}" already exists`);
            }
        }
        
        const updated = await this.productRepository.update(id, data);
        return ProductMapper.toPublicProduct(updated);
    }
    
    async deleteProduct(id: string): Promise<void> {
        const product = await this.productRepository.get(id);
        if (!product) {
            throw new ProductNotFoundError(`Product with ID ${id} not found`);
        }
        
        await this.productRepository.softDelete(id);
    }
}
