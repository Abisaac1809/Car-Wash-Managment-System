import Product from "../entities/Product";
import { PublicProduct } from "../types/dtos/Product.dto";

export default class ProductMapper {
    static toPublicProduct(product: Product): PublicProduct {
        return {
            id: product.id,
            categoryId: product.categoryId,
            name: product.name,
            stock: product.stock,
            minStock: product.minStock,
            unitType: product.unitType,
            costPrice: product.costPrice,
            isForSale: product.isForSale,
            status: product.status
        };
    }

    static toPublicProducts(products: Product[]): PublicProduct[] {
        return products.map(product => this.toPublicProduct(product));
    }
}
