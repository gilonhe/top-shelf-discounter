import { products } from '@wix/stores';
import type { ProductServiceResult, ProductDiscountData } from '../types/product.types';

export class ProductService {
  static async fetchMostExpensiveUndiscountedProduct(): Promise<ProductServiceResult> {
    try {
      const productsPriceDescending = await products
        .queryProducts()
        .descending("price")
        .find();

      const undiscountedProducts = productsPriceDescending.items.filter(
        product => !product.discount?.value || product.discount.value === 0
      );

      const mostExpensive = undiscountedProducts[0];
      
      if (!mostExpensive) {
        return { mostExpensive: null };
      }
      
      return {
        mostExpensive: {
          product: mostExpensive,
          price: mostExpensive.priceData?.price,
        }
      };

    } catch (err) {
      console.error("Error fetching products:", err);
      return { mostExpensive: null };
    }
  }

  static async applyDiscount(
    productId: string, 
    discountData: ProductDiscountData
  ): Promise<boolean> {
    try {
      const updatedProduct = await products.updateProduct(productId, {
        discount: {
          type: discountData.discountType === 'percentage' ? 'PERCENT' : 'AMOUNT',
          value: discountData.discountValue
        }
      });
      
      return !!updatedProduct;
    } catch (err) {
      console.error("Error applying discount:", err);
      return false;
    }
  }
}