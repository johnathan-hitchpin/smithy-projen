import { IConstruct } from "constructs";
import { SmithyDockerPhase } from "./SmithyDockerPhase";
import * as templates from "./templates";
import type * as tt from './templates';
import type { SmithyProjectCommon } from './SmithyProjectCommon';
import { SmithyTarget } from "./SmithyTarget";
import * as v from './versions';
import { TypeScriptServerPhase } from './SmithyDockerPhase';

type SmithyTsServerOptionalTargetOptions = {
    smithy: tt.SmithyOptions
    projectName: string,
    srcPath: string,
    outputDirectory: string,
    packageSemver: string,
};
export type SmithyTsServerTargetOptions = {
    targetService: string,
    packageName: string,
    project: SmithyProjectCommon
} & Partial<SmithyTsServerOptionalTargetOptions>;

export class SmithyTsServerTarget extends SmithyTarget {
    constructor(scope: IConstruct, options: SmithyTsServerTargetOptions) {
        super(scope);

        const filledIn: SmithyTsServerOptionalTargetOptions = {
            smithy: options.smithy ?? {
                smithyVersion: v.DefaultSmithyVersion,
                smithyCliVersion: v.DefaultSmithyCliVersion,
                smithyPluginVersion: v.DefaultSmithyPluginVersion,
            },
            projectName: 'ts-server',
            srcPath: '.gen-src/ts-server',
            outputDirectory: 'build/output',
            packageSemver: '1.0.0'
        }
        this.files = new templates.TsServerFiles(this, {
            ...options,
            ...filledIn,
            typescriptCodegenVersion: v.DefaultSmithyTypeScriptCodegenVersion
        });
        this.phases = [
            new TypeScriptServerPhase({
                srcDir: filledIn.srcPath,
                outDir: `./outputs/${filledIn.projectName}`,
                projectName: filledIn.projectName
            })
        ];
    }

    readonly phases: SmithyDockerPhase[] = [];
    readonly files: templates.SmithyFiles;
}