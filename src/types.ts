export interface ItemAditional {
  title: string;
  price: number;
  minimumAmount: number;
  maximumAmount: number;
  order: number;
  id?: string;
}
export interface Ingredienties {
  id: string;
  title: string;
  ean: string;
  minimumStock: number;
  company: {
    id: string;
    name: string;
  },
  unitMeasure: {
    id: string;
    unit: string;
  };
  stocks: [
    {
      id: string;
      stock: number,
      pointOfSale: {
        id:string;
        name: string;
      }
    }
  ]
}
export interface AditionalProps {
  id?: string;
  order: number;
  seePrice: boolean;
  title: string;
  description: string;
  minimumAmount: number;
  maximumAmount: number;
  complementType: string;
  complementFormula: string;
  complementItems: ItemAditional[];
}
export interface IntegrationIfoodProps {
  id: string;
  image: {
    link: string;
    ref: string;
  };
  name: string;
  slug: string;
  category: string;
  ifood?: string ;
}

export interface PointOfSale {
  id: string;
  image?: {
    link: string;
    ref: string;
  };
  name: string;
  whatsapp: string;
  instagram: string;
  slug: string;
  description: string;
  openPointOfSale: boolean;
  active: boolean;
  category: string;
}

export interface ProductProps {
  id?: string;
  name: string;
  description: string;
  price: number;
  servesPeople: number;
  order: number;
  active: boolean;
  amount: number | null;
  minimumStock: number;
  preparationTime: number;
  listed: boolean;
  note: string;
  establishment: string;
  category: Category;
  complements: AditionalProps[];
  tags: string[];
  ean:string;
  manageStock: boolean;
  images?: string[]
}

export interface Category {
  id: string;
  title: string;
}

export interface FormulaAdditional {
  id: string;
  formula: string;
}
export interface TypesAdditional {
  id: string;
  type: string;
}
export interface ProductCategory {
  id: string;
  title: string;
}
export interface TagType {
  id: string;
  tagName: string;
}

export interface Comapany {
  active: boolean;
  description: string;
  id: string;
  image: string;
  name: string;
  slug: string;
}

export interface User {
  id: string,
  name: string,
  email: string,
  telephone: string,
  password:string,
  pointOfSaleId: string,
  superUser: boolean
}
export interface SelectedRow {
  ingredientId: string;
  measure: string;
}
