export interface AttributeDetail {
  attributeId: number;
  name: string;
  value: string;
  unit?: string;
}

export interface ProductAttributeGroup {
  productId: number;
  productName: string;
  attributes: AttributeDetail[];
}