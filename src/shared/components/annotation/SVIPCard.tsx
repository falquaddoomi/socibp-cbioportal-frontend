import * as React from 'react';
import { If, Then, Else } from 'react-if';
import { ISVIPVariantData } from "shared/model/SVIP.ts";
import "./styles/SVIPCard.scss";
import * as _ from "lodash";

export interface ISVIPCardProps {
    title: string;
    geneName: string;
    geneDescription: string;
    geneUrl: string;
    variants: { [name: string]: ISVIPVariantData };
}

interface SVIPDisease {
    name: string;
    status: string;
    pathogenic: string | null;
    clinical_significance: string | null;
    nb_patients: number;
    gender_balance: {[gender: string]: number};
    age_distribution: {[bracket: string]: number};
    score: number;
}

export default class SVIPCard extends React.Component<ISVIPCardProps, {}> {
    constructor() {
        super();
    }

    /**
     * Render svip card component
     * @returns {any}
     */
    public render() {
        console.log(this.props.variants);

        return (
            <div className="svip-card">
                <span>
                    <div className="col s12 tip-header">
                        {this.props.title}
                    </div>
                    <div className="col s12 svip-card-content">
                        <div className="col s12 svip-card-gene">
                            <span className="svip-card-gene-name">
                                <b>Gene:</b> <a href={this.props.geneUrl} target="_blank">{this.props.geneName} <i className="fa fa-external-link"></i></a>
                            </span>
                        </div>

                        <div className="col s12 svip-card-variant">
                            {_.values(this.props.variants).map(x => (
                                <div className="variant_entry">
                                    <div className="svip-card-variant-name">
                                        <b>Variant:</b> <a href={x.url} target="_blank">{x.name} <i className="fa fa-external-link"></i></a>
                                    </div>

                                    <table className="disease-table">
                                        <tr>
                                            <th>Disease</th>
                                            <th>Patient Ct.</th>
                                            <th>Pathogenicity</th>
                                            <th>Clinical Significance</th>
                                            <th>Status</th>
                                            <th>SVIP Confidence</th>
                                        </tr>

                                        {
                                            x.svip_data.diseases.map((disease : SVIPDisease) => (
                                                <tr>
                                                    <td>{disease.name}</td>
                                                    <td>{disease.nb_patients}</td>
                                                    <td>{disease.pathogenic || '-'}</td>
                                                    <td>{disease.clinical_significance}</td>
                                                    <td>{disease.status}</td>
                                                    <td>{
                                                        Array.from({ length: 4 }).map((_, idx) => (
                                                            (disease.score <= idx)
                                                                ? <i className="fa fa-star-o" />
                                                                : <i className="fa fa-star" />
                                                        ))
                                                    }</td>
                                                </tr>
                                            ))
                                        }
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                </span>

                <div className="item footer">
                    <a href={this.props.geneUrl} target="_blank">
                        <img src={require("./images/SVIP_Logo_text.png")} className="svip-logo" alt="SVIP"/>
                    </a>
                </div>
            </div>
        );
    }
}
