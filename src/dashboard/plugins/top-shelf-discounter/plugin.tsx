import React, { type FC } from 'react';
import type { plugins } from '@wix/stores/dashboard'; 
import {
  Button,
  Card,
  Heading,
  Text,
  WixDesignSystemProvider,
  Box,
  Loader,
  Image
} from "@wix/design-system";
import '@wix/design-system/styles.global.css';
import { dashboard } from "@wix/dashboard";
import { useProductData } from '../../../shared/hooks/useProductData';

type Props = plugins.Products.ProductsBannerParams;

const Plugin: FC<Props> = (props) => {
  const { mostExpensive, isLoading, error } = useProductData();

  if (isLoading) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Card>
          <Card.Header title="Top Shelf Discounter" />
          <Card.Divider />
          <Card.Content size="medium">
            <Box align="center" justify="center" padding="20px">
              <Loader />
            </Box>
          </Card.Content>
        </Card>
      </WixDesignSystemProvider>
    );
  }

  if (error) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Card>
          <Card.Header title="Top Shelf Discounter" />
          <Card.Divider />
          <Card.Content size="medium">
            <Text color="error">Error: {error}</Text>
          </Card.Content>
        </Card>
      </WixDesignSystemProvider>
    );
  }

  if (!mostExpensive) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Card>
          <Card.Header title="Top Shelf Discounter" />
          <Card.Divider />
          <Card.Content size="medium">
            <Text>No undiscounted products found.</Text>
          </Card.Content>
        </Card>
      </WixDesignSystemProvider>
    );
  }

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Card>
        <Card.Header title="Top Shelf Discounter" />
        <Card.Divider />
        <Card.Content size="medium">
          <Box direction="horizontal" gap="16px" align="center" justify="space-between">
            <Box direction="horizontal" gap="16px" align="center">
              {mostExpensive.product.media?.mainMedia?.image?.url && (
                <Image
                  src={mostExpensive.product.media.mainMedia.image.url}
                  alt={mostExpensive.product.name || 'Product image'}
                  width={60}
                  height={60}
                  fit="cover"
                />
              )}
              <Box direction="vertical">
                <Heading size="small" as="h3">
                  Product Name: {mostExpensive.product.name}
                </Heading>
                <Text size="medium">
                  Price: ${mostExpensive.price}
                </Text>
              </Box>
            </Box>
            <Button 
              size="small" 
              priority="secondary" 
              onClick={() => dashboard.navigate({ pageId: "815888e2-c48e-4be7-b1ba-81eeeed0d109" })}
            >
              Make it Affordable
            </Button>
          </Box>
        </Card.Content>
      </Card>
    </WixDesignSystemProvider>
  );
};

export default Plugin;