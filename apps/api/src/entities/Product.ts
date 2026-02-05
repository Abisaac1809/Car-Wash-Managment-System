import { ProductType } from "../types/dtos/Product.dto";
import { UnitType } from "../types/enums";

export default class Product {
    public readonly id: string;
    public categoryId: string | null;
    public name: string;
    public stock: number;
    public minStock: number;
    public unitType: UnitType | null;
    public costPrice: number;
    public isForSale: boolean;
    public status: boolean;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: ProductType) {
        this.id = data.id;
        this.categoryId = data.categoryId;
        this.name = data.name;
        this.stock = data.stock;
        this.minStock = data.minStock;
        this.unitType = data.unitType;
        this.costPrice = data.costPrice;
        this.isForSale = data.isForSale;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}
