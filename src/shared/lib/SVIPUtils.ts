import * as _ from 'lodash';
import {ISVIPEntry, ISVIPGene, ISVIPGeneData, ISVIPVariantSet, ISVIPVariantData} from "shared/model/SVIP.ts";
import * as request from "superagent";

type MutationSpec = {gene:{hugoGeneSymbol: string}, proteinChange: string};

type SVIPAPIGene = {
    id: number;
    name: string;
    [propName: string]: any;
};

type SVIPAPIGeneVariant = {
    name: string;
    id: number;
    [propName: string]: any;
};

type SVIPAPIVariant = {
    id: number,
    gene_symbol: string;
    name: string;
    svip_data: any;
    [propName: string]: any;
};

/**
 * Asynchronously return a map with SVIP information from the genes given.
 */
export function getSVIPGenes(geneSymbols: string[]): Promise<ISVIPGene> {
    return request.get('https://svip-dev.nexus.ethz.ch/api/v1/genes')
        .then((res) => {
            return res.body.results.map((record: SVIPAPIGene) => ({
                id: record.id,
                name: record.symbol,
                url: 'https://svip-dev.nexus.ethz.ch/gene/' + record.id
            }));
        }).then((result) => {
            // filter the collection after the fact down to the mentioned IDs
            const genes = result.filter((x : SVIPAPIGene) => geneSymbols.includes(x.name));

            return genes.reduce((acc : ISVIPGene, x:ISVIPGeneData) => {
                acc[x.name] = x;
                return acc;
            }, {});
        });
}

/**
 * Asynchronously retrieve a map with SVIP information from the mutationSpecs given for all genes in svipGenes.
 * If no mutationSpecs are given, then return the SVIP information of all the CNA variants of the genes in svipGenes.
 */
export function getSVIPVariants(svipGenes: ISVIPGene, mutationSpecs?: MutationSpec[]): Promise<ISVIPVariantSet> {
    return request.get('https://svip-dev.nexus.ethz.ch/api/v1/variants')
        .query({ in_svip: true, inline_svip_data: true })
        .then((res) => {
            let variants : ISVIPVariantData[] = res.body.results;

            /*
            if (mutationSpecs) {
                variants = variants.filter((x : ISVIPVariantData) => {
                    return mutationSpecs.some(
                        y => y.gene.hugoGeneSymbol === x.gene_symbol && y.proteinChange === x.name
                    );
                });
            }
            */

            return variants.reduce((acc, x) => {
                // the expected result is {[gene_symbol][protienChange]: variant_data}
                if (!acc[x.gene_symbol]) {
                    acc[x.gene_symbol] = {};
                }

                acc[x.gene_symbol][x.name] = {
                    id: x.id,
                    name: x.name,
                    gene_symbol: x.gene_symbol,
                    description: x.description,
                    url: `https://svip-dev.nexus.ethz.ch/gene/${x.gene.id}/variant/${x.id}`,
                    svip_data: x.svip_data
                };

                return acc;

            }, {} as ISVIPVariantSet);
        });
}
