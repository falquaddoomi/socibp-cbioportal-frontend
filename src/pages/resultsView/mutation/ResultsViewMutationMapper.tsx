import * as React from 'react';
import {observer} from "mobx-react";
import {computed} from "mobx";

import {EnsemblTranscript} from "public-lib/api/generated/GenomeNexusAPI";
import DiscreteCNACache from "shared/cache/DiscreteCNACache";
import CancerTypeCache from "shared/cache/CancerTypeCache";
import MutationCountCache from "shared/cache/MutationCountCache";
import GenomeNexusMyVariantInfoCache from "shared/cache/GenomeNexusMyVariantInfoCache";

import {
    IMutationMapperProps, default as MutationMapper
} from "shared/components/mutationMapper/MutationMapper";

import MutationRateSummary from "pages/resultsView/mutation/MutationRateSummary";
import ResultsViewMutationMapperStore from "pages/resultsView/mutation/ResultsViewMutationMapperStore";
import ResultsViewMutationTable from "pages/resultsView/mutation/ResultsViewMutationTable";
import {getMobxPromiseGroupStatus} from "../../../shared/lib/getMobxPromiseGroupStatus";

export interface IResultsViewMutationMapperProps extends IMutationMapperProps
{
    store:ResultsViewMutationMapperStore;
    discreteCNACache?:DiscreteCNACache;
    cancerTypeCache?:CancerTypeCache;
    mutationCountCache?:MutationCountCache;
    genomeNexusMyVariantInfoCache?:GenomeNexusMyVariantInfoCache;
    userEmailAddress:string;
}

@observer
export default class ResultsViewMutationMapper extends MutationMapper<IResultsViewMutationMapperProps>
{
    constructor(props: IResultsViewMutationMapperProps) {
        super(props);
    }

    @computed get mutationRateSummary():JSX.Element|null {
        // TODO we should not be even calculating mskImpactGermlineConsentedPatientIds for studies other than msk impact
        if (this.props.store.germlineConsentedSamples &&
            this.props.store.germlineConsentedSamples.result &&
            this.props.store.mutationData.isComplete &&
            this.props.store.mutationData.result.length > 0) {
            return (
                <MutationRateSummary
                    hugoGeneSymbol={this.props.store.gene.hugoGeneSymbol}
                    molecularProfileIdToMolecularProfile={this.props.store.molecularProfileIdToMolecularProfile}
                    mutations={this.props.store.mutationData.result}
                    samples={this.props.store.samples.result!}
                    germlineConsentedSamples={this.props.store.germlineConsentedSamples}
                />
            );
        } else {
            return null;
        }
    }

    protected get isMutationTableDataLoading() {
        return getMobxPromiseGroupStatus(
            this.props.store.clinicalDataForSamples,
            this.props.store.studiesForSamplesWithoutCancerTypeClinicalData,
            this.props.store.canonicalTranscript
        ) === "pending";
    }

    protected get totalExonNumber() {
        const canonicalTranscriptId = this.props.store.canonicalTranscript.result && this.props.store.canonicalTranscript.result.transcriptId;
        const transcript = (this.props.store.activeTranscript && (this.props.store.activeTranscript === canonicalTranscriptId) ?
            this.props.store.canonicalTranscript.result : this.props.store.transcriptsByTranscriptId[this.props.store.activeTranscript!]) as EnsemblTranscript;
        return transcript && transcript.exons && transcript.exons.length > 0 ? transcript.exons.length.toString() : 'None';
    }

    protected get mutationTableComponent(): JSX.Element|null
    {
        return (
            <ResultsViewMutationTable
                uniqueSampleKeyToTumorType={this.props.store.uniqueSampleKeyToTumorType}
                oncoKbCancerGenes={this.props.store.oncoKbCancerGenes}
                discreteCNACache={this.props.discreteCNACache}
                studyIdToStudy={this.props.store.studyIdToStudy.result}
                molecularProfileIdToMolecularProfile={this.props.store.molecularProfileIdToMolecularProfile.result}
                oncoKbEvidenceCache={this.props.oncoKbEvidenceCache}
                pubMedCache={this.props.pubMedCache}
                mutationCountCache={this.props.mutationCountCache}
                genomeNexusCache={this.props.genomeNexusCache}
                genomeNexusMyVariantInfoCache={this.props.genomeNexusMyVariantInfoCache}
                dataStore={this.props.store.dataStore}
                itemsLabelPlural={this.itemsLabelPlural}
                downloadDataFetcher={this.props.store.downloadDataFetcher}
                myCancerGenomeData={this.props.myCancerGenomeData}
                hotspotData={this.props.store.indexedHotspotData}
                indexedVariantAnnotations={this.props.store.indexedVariantAnnotations}
                cosmicData={this.props.store.cosmicData.result}
                oncoKbData={this.props.store.oncoKbData}
                civicGenes={this.props.store.civicGenes}
                civicVariants={this.props.store.civicVariants}
                userEmailAddress={this.props.userEmailAddress}
                enableOncoKb={this.props.config.show_oncokb}
                enableFunctionalImpact={this.props.config.show_genomenexus}
                enableHotspot={this.props.config.show_hotspot}
                enableMyCancerGenome={this.props.config.mycancergenome_show}
                enableCivic={this.props.config.show_civic}
                totalNumberOfExons={this.totalExonNumber}
            />
        );
    }

    protected get mutationTable(): JSX.Element|null
    {
        return (
            <span>
                {!this.isMutationTableDataLoading && this.mutationTableComponent}
            </span>
        );
    }
}
