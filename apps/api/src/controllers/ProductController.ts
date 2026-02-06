import { Request, Response, NextFunction } from 'express';
import IProductService from '../interfaces/IServices/IProductService';
import { ProductToCreateType, ProductToUpdateType, ProductFiltersForService } from '../types/dtos/Product.dto';

export default class ProductController {
    constructor(private productService: IProductService) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productData: ProductToCreateType = req.body;
            const newProduct = await this.productService.createProduct(productData);
            res.status(201).json({
                message: 'Product created successfully',
                product: newProduct,
            });
        } catch (error) {
            next(error);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Product ID is required' });
                return;
            }
            const product = await this.productService.getProductById(id);
            res.status(200).json({
                message: 'Product retrieved successfully',
                product,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Using res.locals.validatedQuery populated by ValidateQueryParams middleware
            const filters: ProductFiltersForService = res.locals.validatedQuery;
            const result = await this.productService.getListOfProducts(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Product ID is required' });
                return;
            }
            const productData: ProductToUpdateType = req.body;
            const updatedProduct = await this.productService.updateProduct(id, productData);
            res.status(200).json({
                message: 'Product updated successfully',
                product: updatedProduct,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Product ID is required' });
                return;
            }
            await this.productService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}