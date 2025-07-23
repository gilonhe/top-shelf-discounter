import { useState, useEffect } from 'react';
import { ProductService } from '../services/productService';
import type { MostExpensiveUndiscountedProduct, ProductDiscountData } from '../types/product.types';

interface UseProductDataReturn {
  mostExpensive: MostExpensiveUndiscountedProduct | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  applyDiscount: (discountData: ProductDiscountData) => Promise<boolean>;
}

export const useProductData = (): UseProductDataReturn => {
  const [mostExpensive, setMostExpensive] = useState<MostExpensiveUndiscountedProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { mostExpensive } = await ProductService.fetchMostExpensiveUndiscountedProduct();
      setMostExpensive(mostExpensive);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product data');
      console.error("Failed to fetch product data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyDiscount = async (discountData: ProductDiscountData): Promise<boolean> => {
    if (!mostExpensive?.product._id) {
      return false;
    }

    try {
      const success = await ProductService.applyDiscount(mostExpensive.product._id, discountData);
      if (success) {
        // Refetch data to get updated product info
        await fetchData();
      }
      return success;
    } catch (err) {
      console.error("Failed to apply discount:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    mostExpensive,
    isLoading,
    error,
    refetch: fetchData,
    applyDiscount
  };
};