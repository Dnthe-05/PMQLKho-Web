export interface AttributeDetail {
  name: string;
  value: string;
  unit?: string;
}

export interface ProductAttributeGroup {
  productId: number;
  productName: string;
  attributes: AttributeDetail[];
}