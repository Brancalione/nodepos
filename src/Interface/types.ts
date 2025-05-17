export interface Produto {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    pictureUrl: string;
  }
 
export interface ProdutoPermitido {
    id?: string;
    name: string;
    pictureUrl: string;
} 