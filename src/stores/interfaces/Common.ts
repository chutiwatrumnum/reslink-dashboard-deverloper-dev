export interface CommonType {
  masterData: any;
  accessibility: any;
  unitOptions: Array<{ label: string; value: number }>;
  unitFilter: any;
}

export interface MenuItemAccessibilityType {
  available: boolean;
  allowAdd: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
} 