import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import IProductService from '../interfaces/IServices/IProductService';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import { ProductToCreate, ProductToUpdate, ProductFilters } from '../schemas/Product.schema';

export default function createProductRouter(productService: IProductService): Router {
    const router = Router();
    const controller = new ProductController(productService);

    router.post('/', validateSchema(ProductToCreate), controller.create);
    router.get('/', validateQueryParams(ProductFilters), controller.list);
    router.get('/:id', controller.get);
    router.patch('/:id', validateSchema(ProductToUpdate), controller.update);
    router.delete('/:id', controller.delete);

    return router;
}
