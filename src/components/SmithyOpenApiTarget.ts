import { IConstruct } from "constructs";
import { Component } from "projen";
import { SmithyDockerPhase } from "./SmithyDockerPhase";
import * as templates from "./templates";
import type * as tt from './templates';
import type { SmithyProjectCommon } from './SmithyProjectCommon';
import { SmithyTarget } from "./SmithyTarget";
import * as v from './versions';

type SmithyOpenApiOptionalTargetOptions = {
    smithy: tt.SmithyOptions
    projectName: string,
    srcPath: string,
    outputDirectory: string,
    protocol: string,
};
export type SmithyOpenApiTargetOptions = {
    targetService: string,
    project: SmithyProjectCommon
} & Partial<SmithyOpenApiOptionalTargetOptions>;

export class SmithyOpenApiTarget extends SmithyTarget {
    constructor(scope: IConstruct, options: SmithyOpenApiTargetOptions) {
        super(scope);

        const filledIn: SmithyOpenApiOptionalTargetOptions = {
            smithy: options.smithy ?? {
                smithyVersion: v.DefaultSmithyVersion,
                smithyCliVersion: v.DefaultSmithyCliVersion,
                smithyPluginVersion: v.DefaultSmithyPluginVersion,
            },
            projectName: 'openapi',
            srcPath: '.gen-src/openapi',
            outputDirectory: 'build/output',
            protocol: 'aws.protocols#restJson1'
        }
        this.files = new templates.OpenApiFiles(this, {
            ...options,
            ...filledIn
        });
    }

    readonly phases: SmithyDockerPhase[] = [];
    readonly files: templates.SmithyFiles;
}