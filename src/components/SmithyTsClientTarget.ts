import { IConstruct } from "constructs";
import { Component } from "projen";
import { SmithyDockerPhase } from "./SmithyDockerPhase";
import * as templates from "./templates";
import type * as tt from './templates';
import type { SmithyProjectCommon } from './SmithyProjectCommon';
import { SmithyTarget } from "./SmithyTarget";
import * as v from './versions';
import { TypeScriptClientPhase } from './SmithyDockerPhase';

type SmithyTsClientOptionalTargetOptions = {
    smithy: tt.SmithyOptions
    projectName: string,
    srcPath: string,
    outputDirectory: string,
    packageSemver: string,
};
export type SmithyTsClientTargetOptions = {
    targetService: string,
    packageName: string,
    project: SmithyProjectCommon
} & Partial<SmithyTsClientOptionalTargetOptions>;

export class SmithyTsClientTarget extends SmithyTarget {
    constructor(scope: IConstruct, options: SmithyTsClientTargetOptions) {
        super(scope);

        const filledIn: SmithyTsClientOptionalTargetOptions = {
            smithy: options.smithy ?? {
                smithyVersion: v.DefaultSmithyVersion,
                smithyCliVersion: v.DefaultSmithyCliVersion,
                smithyPluginVersion: v.DefaultSmithyPluginVersion,
            },
            projectName: 'ts-client',
            srcPath: '.gen-src/ts-client',
            outputDirectory: 'build/output',
            packageSemver: '1.0.0'
        }
        this.files = new templates.TsClientFiles(this, {
            ...options,
            ...filledIn,
            typescriptCodegenVersion: v.DefaultSmithyTypeScriptCodegenVersion
        });
        this.phases = [
            new TypeScriptClientPhase({
                srcDir: filledIn.srcPath,
                outDir: `./outputs/${filledIn.projectName}`,
                projectName: filledIn.projectName
            })
        ];
    }

    readonly phases: SmithyDockerPhase[] = [];
    readonly files: templates.SmithyFiles;
}