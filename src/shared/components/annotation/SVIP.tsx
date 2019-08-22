import * as React from 'react';
import * as _ from 'lodash';
import {observer} from "mobx-react";
import {Circle} from "better-react-spinkit";
import DefaultTooltip from 'shared/components/defaultTooltip/DefaultTooltip';
import annotationStyles from "./styles/annotation.module.scss";
import {ISVIPEntry} from "shared/model/SVIP.ts";
import {observable} from "mobx";
import SVIPCard from "./SVIPCard";

export interface ISVIPProps {
    svipEntry: ISVIPEntry | null | undefined;
    svipStatus: "pending" | "error" | "complete";
    hasSVIPVariants: boolean;
}

export function hideArrow(tooltipEl: any) {
    const arrowEl = tooltipEl.querySelector('.rc-tooltip-arrow');
    arrowEl.style.display = 'none';
}

@observer
export default class SVIP extends React.Component<ISVIPProps, {}>
{
    @observable tooltipDataLoadComplete = false;

    public static sortValue(svipEntry:ISVIPEntry | null | undefined): number
    {
        return svipEntry ? 1 : 0;
    }

    constructor(props: ISVIPProps)
    {
        super(props);

        this.cardContent = this.cardContent.bind(this);
    }

    public render()
    {
        let svipContent:JSX.Element = (
            <span className={`${annotationStyles["annotation-item"]}`} />
        );

        const svipImgWidth = 18;
        const svipImgHeight = 14;

        if (this.props.svipStatus === "error") {
            svipContent = this.errorIcon();
        }
        else if (this.props.svipEntry !== undefined)
        {
            if (this.props.svipStatus === "complete")
            {
                let svipImgSrc = require("./images/SVIP_color.png");
                if (this.props.svipEntry === null)
                {
                    svipImgSrc = require("./images/SVIP_bw.png");
                }

                svipContent = (
                    <span className={`${annotationStyles["annotation-item"]}`}>
                        <img
                            width={svipImgWidth}
                            height={svipImgHeight}
                            src={svipImgSrc}
                            alt='SVIP Variant Entry'
                        />
                    </span>
                );

                const arrowContent = <div className="rc-tooltip-arrow-inner"/>;

                svipContent = (
                    <DefaultTooltip
                        overlay={this.cardContent.bind(this, this.props.svipEntry)}
                        placement="right"
                        trigger={['hover', 'focus']}
                        arrowContent={arrowContent}
                        onPopupAlign={hideArrow}
                        destroyTooltipOnHide={false}
                    >
                        {svipContent}
                    </DefaultTooltip>
                );
            }
        }
        else
        {
            // It's still unknown (undefined) if the current gene has a SVIP entry or not.
            svipContent = this.loaderIcon();
        }

        return svipContent;
    }

    public loaderIcon()
    {
        return (
            <Circle size={18} scaleEnd={0.5} scaleStart={0.2} color="#aaa" className="pull-left"/>
        );
    }

    public errorIcon()
    {
        return (
            <DefaultTooltip
                overlay={<span>Error fetching SVIP data</span>}
                placement="right"
                trigger={['hover', 'focus']}
                destroyTooltipOnHide={true}
            >
                <span className={`${annotationStyles["annotation-item-error"]}`}>
                    <i className="fa fa-exclamation-triangle text-danger" />
                </span>
            </DefaultTooltip>
        );
    }

    private cardContent(svipEntry: ISVIPEntry): JSX.Element
    {
        return (
            <SVIPCard
                title={`SVIP Variants`}
                geneName={svipEntry.name}
                geneDescription={svipEntry.description}
                geneUrl={svipEntry.url}
                variants={svipEntry.variants}
            />
        );
    }
}
