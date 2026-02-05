import { PrismaClient } from '../generated/prisma';

import PrismaCategoryRepository from '../repositories/PrismaCategoryRepository';
import PrismaProductRepository from '../repositories/PrismaProductRepository';

import CategoryService from '../services/CategoryService';
import ProductService from '../services/ProductService';

export interface Container {
    prisma: PrismaClient;

    categoryRepository: PrismaCategoryRepository;
    productRepository: PrismaProductRepository;
    categoryService: CategoryService;
    productService: ProductService;
}

export function createContainer(prisma: PrismaClient): Container {
    const categoryRepository = new PrismaCategoryRepository(prisma);
    const productRepository = new PrismaProductRepository(prisma);

    const categoryService = new CategoryService(categoryRepository, productRepository);
    const productService = new ProductService(productRepository, categoryRepository);

    return {
        prisma,
        categoryRepository,
        productRepository,
        categoryService,
        productService,
    };
}
