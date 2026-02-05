import { PrismaClient, Prisma } from '../generated/prisma';
import Product from '../entities/Product';
import IProductRepository from '../interfaces/IRepositories/IProductRepository';
import { ProductToCreateType, ProductToUpdateType } from '../schemas/Product.schema';
import { ProductFiltersForRepository, ProductFiltersForCount } from '../types/dtos/Product.dto';
import { UnitType } from '../types/enums';

export default class PrismaProductRepository implements IProductRepository {
    constructor(private prisma: PrismaClient) {}
    
    async create(data: ProductToCreateType): Promise<Product> {
        const created = await this.prisma.product.create({
            data: {
                categoryId: data.categoryId,
                name: data.name,
                minStock: data.minStock,
                unitType: data.unitType as UnitType | null | undefined,
                costPrice: data.costPrice,
                isForSale: data.isForSale,
                status: data.status,
                stock: data.stock,
            },
        });
        return this.mapToEntity(created);
    }
    
    async get(id: string): Promise<Product | null> {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
        });
        return product ? this.mapToEntity(product) : null;
    }
    
    async getByName(name: string): Promise<Product | null> {
        const product = await this.prisma.product.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
        });
        return product ? this.mapToEntity(product) : null;
    }
    
    async list(filters: ProductFiltersForRepository): Promise<Product[]> {
        if (filters.lowStock) {
            return this.listLowStock(filters);
        }
        
        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
        };
        
        if (filters.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.isForSale !== undefined) {
            where.isForSale = filters.isForSale;
        }
        if (filters.status !== undefined) {
            where.status = filters.status;
        }
        
        const products = await this.prisma.product.findMany({
            where,
            skip: filters.offset,
            take: filters.limit,
            orderBy: { createdAt: 'desc' },
        });
        
        return products.map(p => this.mapToEntity(p));
    }
    
    private async listLowStock(filters: ProductFiltersForRepository): Promise<Product[]> {
        const conditionsSql: Prisma.Sql[] = [Prisma.sql`deleted_at IS NULL`, Prisma.sql`stock < min_stock`];
        
        if (filters.search) {
            conditionsSql.push(Prisma.sql`name ILIKE ${'%' + filters.search + '%'}`);
        }
        if (filters.categoryId) {
            conditionsSql.push(Prisma.sql`category_id = ${filters.categoryId}::uuid`);
        }
        if (filters.isForSale !== undefined) {
            conditionsSql.push(Prisma.sql`is_for_sale = ${filters.isForSale}`);
        }
        if (filters.status !== undefined) {
            conditionsSql.push(Prisma.sql`status = ${filters.status}`);
        }
        
        const whereSql = Prisma.sql`WHERE ${Prisma.join(conditionsSql, ' AND ')}`;
        
        const products = await this.prisma.$queryRaw<any[]>`
        SELECT * FROM products
        ${whereSql}
        ORDER BY created_at DESC
        LIMIT ${filters.limit} OFFSET ${filters.offset}
        `;
        
        return products.map(p => this.mapRawToEntity(p));
    }
    
    async count(filters: ProductFiltersForCount): Promise<number> {
        if (filters.lowStock) {
            return this.countLowStock(filters);
        }
        
        const where: Prisma.ProductWhereInput = {
            deletedAt: null,
        };
        
        if (filters.search) {
            where.name = { contains: filters.search, mode: 'insensitive' };
        }
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (filters.isForSale !== undefined) {
            where.isForSale = filters.isForSale;
        }
        if (filters.status !== undefined) {
            where.status = filters.status;
        }
        
        return await this.prisma.product.count({ where });
    }
    
    private async countLowStock(filters: ProductFiltersForCount): Promise<number> {
        const conditionsSql: Prisma.Sql[] = [Prisma.sql`deleted_at IS NULL`, Prisma.sql`stock < min_stock`];
        
        if (filters.search) {
            conditionsSql.push(Prisma.sql`name ILIKE ${'%' + filters.search + '%'}`);
        }
        if (filters.categoryId) {
            conditionsSql.push(Prisma.sql`category_id = ${filters.categoryId}::uuid`);
        }
        if (filters.isForSale !== undefined) {
            conditionsSql.push(Prisma.sql`is_for_sale = ${filters.isForSale}`);
        }
        if (filters.status !== undefined) {
            conditionsSql.push(Prisma.sql`status = ${filters.status}`);
        }
        
        const whereSql = Prisma.sql`WHERE ${Prisma.join(conditionsSql, ' AND ')}`;
        
        const result = await this.prisma.$queryRaw<any[]>`
        SELECT COUNT(*)::int as count FROM products
        ${whereSql}
        `;
        
        return result[0]?.count || 0;
    }
    
    async update(id: string, data: ProductToUpdateType): Promise<Product> {
        const updated = await this.prisma.product.update({
            where: { id },
            data: {
                categoryId: data.categoryId,
                name: data.name,
                minStock: data.minStock,
                unitType: data.unitType as UnitType | null | undefined,
                costPrice: data.costPrice,
                isForSale: data.isForSale,
                status: data.status,
            },
        });
        return this.mapToEntity(updated);
    }
    
    async softDelete(id: string): Promise<void> {
        await this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    
    async restore(id: string): Promise<void> {
        await this.prisma.product.update({
            where: { id },
            data: { deletedAt: null },
        });
    }
    
    async countByCategoryId(categoryId: string): Promise<number> {
        return await this.prisma.product.count({
            where: {
                categoryId,
                deletedAt: null,
            },
        });
    }
    
    private mapToEntity(p: any): Product {
        return new Product({
            id: p.id,
            categoryId: p.categoryId,
            name: p.name,
            stock: p.stock.toNumber(),
            minStock: p.minStock.toNumber(),
            unitType: p.unitType,
            costPrice: p.costPrice.toNumber(),
            isForSale: p.isForSale,
            status: p.status,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            deletedAt: p.deletedAt,
        });
    }
    
    private mapRawToEntity(p: any): Product {
        return new Product({
            id: p.id,
            categoryId: p.category_id,
            name: p.name,
            stock: Number(p.stock),
            minStock: Number(p.min_stock),
            unitType: p.unit_type,
            costPrice: Number(p.cost_price),
            isForSale: p.is_for_sale,
            status: p.status,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            deletedAt: p.deleted_at,
        });
    }
}