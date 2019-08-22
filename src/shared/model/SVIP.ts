export interface ISVIPGeneData {
    id: number;
    name: string;
    url: string;
}

export interface ISVIPVariantData {
    id: number;
    name: string;
    description: string;
    gene_symbol: string;
    url: string;
    svip_data: any;
    [propName: string]: any;
}

export interface ISVIPGene {[name: string]: ISVIPGeneData;}

export interface ISVIPVariantSet { [geneName: string]: {[variantName: string]: ISVIPVariantData}; }

export interface ISVIPEntry {
    name: string;
    description: string;
    url: string;
    variants: {[name: string]: ISVIPVariantData};
}

export type MobXStatus = "pending" | "error" | "complete";

export interface ISVIPGeneDataWrapper {
    status: MobXStatus;
    result?: ISVIPGene;
}

export interface ISVIPVariantDataWrapper {
    status: MobXStatus;
    result?: ISVIPVariantSet;
}
