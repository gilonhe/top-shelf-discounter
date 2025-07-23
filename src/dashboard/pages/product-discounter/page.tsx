import React, { type FC, useState } from 'react';
import {
  Button,
  Card,
  Heading,
  Text,
  Page,
  WixDesignSystemProvider,
  Box,
  Loader,
  Image,
  Input,
  Dropdown,
  Toast
} from "@wix/design-system";
import '@wix/design-system/styles.global.css';
import { useProductData } from '../../../shared/hooks/useProductData';
import type { ProductDiscountData } from '../../../shared/types/product.types';

const DashboardPage: FC = () => {
  const { mostExpensive, isLoading, error, applyDiscount } = useProductData();
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  const handleApplyDiscount = async () => {
    const value = parseFloat(discountValue);
    if (isNaN(value) || value <= 0) {
      setShowToast({
        show: true,
        type: 'error',
        message: 'Please enter a valid discount value'
      });
      return;
    }

    setIsApplying(true);
    try {
      const success = await applyDiscount({ discountType, discountValue: value });
      if (success) {
        setShowToast({
          show: true,
          type: 'success',
          message: 'Discount applied successfully!'
        });
        setDiscountValue('');
      } else {
        setShowToast({
          show: true,
          type: 'error',
          message: 'Failed to apply discount'
        });
      }
    } catch (err) {
      setShowToast({
        show: true,
        type: 'error',
        message: 'An error occurred while applying the discount'
      });
    } finally {
      setIsApplying(false);
    }
  };

  const discountOptions = [
    { id: 'percentage', value: 'Percentage (%)' },
    { id: 'fixed', value: 'Fixed Amount ($)' }
  ];

  if (isLoading) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Page>
          <Page.Header title="Product Discounter" />
          <Page.Content>
            <Box align="center" justify="center" padding="40px">
              <Loader size="large" />
            </Box>
          </Page.Content>
        </Page>
      </WixDesignSystemProvider>
    );
  }

  if (error) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Page>
          <Page.Header title="Product Discounter" />
          <Page.Content>
            <Card>
              <Card.Content>
                <Text color="error">Error: {error}</Text>
              </Card.Content>
            </Card>
          </Page.Content>
        </Page>
      </WixDesignSystemProvider>
    );
  }

  if (!mostExpensive) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Page>
          <Page.Header title="Product Discounter" />
          <Page.Content>
            <Card>
              <Card.Content>
                <Text>No undiscounted products found to apply discount to.</Text>
              </Card.Content>
            </Card>
          </Page.Content>
        </Page>
      </WixDesignSystemProvider>
    );
  }

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page>
        <Page.Header 
          title="Product Discounter"
          subtitle="Apply a discount to your most expensive undiscounted product"
        />
        <Page.Content>
          <Card>
            <Card.Header title="Product Details" />
            <Card.Divider />
            <Card.Content>
              <Box direction="horizontal" gap="24px" align="center" marginBottom="24px">
                {mostExpensive.product.media?.mainMedia?.image?.url && (
                  <Image
                    src={mostExpensive.product.media.mainMedia.image.url}
                    alt={mostExpensive.product.name || 'Product image'}
                    width={120}
                    height={120}
                    fit="cover"
                  />
                )}
                <Box direction="vertical" gap="8px">
                  <Heading size="medium">
                    {mostExpensive.product.name}
                  </Heading>
                  <Text size="large" weight="bold">
                    Current Price: ${mostExpensive.price}
                  </Text>
                  {mostExpensive.product.description && (
                    <Text size="small" color="secondary">
                      {mostExpensive.product.description}
                    </Text>
                  )}
                </Box>
              </Box>

              <Box direction="vertical" gap="16px">
                <Heading size="small">Apply Discount</Heading>
                
                <Box direction="horizontal" gap="16px" align="end">
                  <Box direction="vertical" gap="8px">
                    <Text size="small">Discount Type</Text>
                    <Dropdown
                      placeholder="Select discount type"
                      options={discountOptions}
                      selectedId={discountType}
                      onSelect={(option) => setDiscountType(option?.id as 'percentage' | 'fixed')}
                    />
                  </Box>
                  
                  <Box direction="vertical" gap="8px">
                    <Text size="small">
                      Discount Value {discountType === 'percentage' ? '(%)' : '($)'}
                    </Text>
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === 'percentage' ? '10' : '5.00'}
                      min="0"
                      step={discountType === 'percentage' ? '1' : '0.01'}
                    />
                  </Box>
                  
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={isApplying || !discountValue}
                  >
                    {isApplying ? 'Applying...' : 'Apply Discount'}
                  </Button>
                </Box>
              </Box>
            </Card.Content>
          </Card>
        </Page.Content>

        {showToast.show && (
          <Toast
            timeout={3000}
            type={showToast.type}
            onTimeout={() => setShowToast({ ...showToast, show: false })}
          >
            <Text>{showToast.message}</Text>
          </Toast>
        )}
      </Page>
    </WixDesignSystemProvider>
  );
};

export default DashboardPage;

