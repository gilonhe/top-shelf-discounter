import type { products } from '@wix/stores';

export interface MostExpensiveUndiscountedProduct {
  product: products.Product;
  price: number | null | undefined;
}

export interface ProductServiceResult {
  mostExpensive: MostExpensiveUndiscountedProduct | null;
}

export interface ProductDiscountData {
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}