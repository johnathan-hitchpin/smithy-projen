import { IConstruct } from "constructs";
import { Component, JsonFile, TextFile } from "projen";
import { SmithyFiles, type SmithyOptions } from "./common";
import type { SmithyProjectCommon } from '../SmithyProjectCommon';
import Handlebars from "handlebars";
import * as path from 'path';
import * as fs from 'fs';

type HbTemplate = ReturnType<typeof Handlebars.compile>;
type TsClientTemplate = 'smithy-build.json' | 'build.gradle' | 'settings.gradle';
const getTemplate = (name: TsClientTemplate): HbTemplate => {
    const p = path.join(__dirname, 'ts-client/' + name);
    const str = fs.readFileSync(p).toString('utf8');
    return Handlebars.compile(str);
}


const sbJsonTemplate = getTemplate('smithy-build.json');
const buildGradleTemplate = getTemplate('build.gradle');
const settingsGradleTemplate = getTemplate('settings.gradle');

type TsClientSmithyBuildJsonFileOptions = {
    path: string,
    tsClientOutputDirectory: string,
    tsClientPackageName: string,
    tsClientPackageSemver: string
}
export class TsClientSmithyBuildJsonFile extends JsonFile {
    constructor(scope: IConstruct, options: TsClientSmithyBuildJsonFileOptions) {
        super(scope, `${options.path}/smithy-build.json`, {
            obj: JSON.parse(sbJsonTemplate({
                ...options
            }))
        });
    }
}

type TsClientBuildGradleFileOptions = SmithyProjectCommon & SmithyOptions & {
    path: string,
    smithyTypescriptCodegenVersion: string
}
export class TsClientBuildGradleFile extends TextFile {
    constructor(scope: IConstruct, options: TsClientBuildGradleFileOptions) {
        super(scope, `${options.path}/build.gradle`, {
            lines: buildGradleTemplate({
                ...options
            }).split('\n')
        });
    }
}

type TsClientSettingsGradleFileOptions = {
    path: string,
    tsClientProjectName: string
}
export class TsClientSettingsGradleFile extends TextFile {
    constructor(scope: IConstruct, options: TsClientSettingsGradleFileOptions) {
        super(scope, `${options.path}/settings.gradle`, {
            lines: settingsGradleTemplate({
                ...options
            }).split('\n')
        });
    }
}

type TsClientFilesOptions = {
    projectName: string,
    srcPath: string,
    outputDirectory: string,
    packageName: string,
    packageSemver: string,
    typescriptCodegenVersion: string,
    smithy: SmithyOptions,
    project: SmithyProjectCommon
}

export class TsClientFiles extends SmithyFiles {

    public readonly smithyBuild: TsClientSmithyBuildJsonFile;
    public readonly gradleBuild: TsClientBuildGradleFile;
    public readonly gradleSettings: TsClientSettingsGradleFile;

    constructor(scope: IConstruct, options: TsClientFilesOptions) {
        super(scope);

        this.smithyBuild = new TsClientSmithyBuildJsonFile(this, {
            path: options.srcPath,
            tsClientOutputDirectory: options.outputDirectory,
            tsClientPackageName: options.packageName,
            tsClientPackageSemver: options.packageSemver,
            ...options.smithy
        });
        this.gradleBuild = new TsClientBuildGradleFile(this, {
            path: options.srcPath,
            ...options.smithy,
            ...options.project,
            smithyTypescriptCodegenVersion: options.typescriptCodegenVersion
        });
        this.gradleSettings = new TsClientSettingsGradleFile(this, {
            path: options.srcPath,
            tsClientProjectName: options.projectName
        });
        this.srcPath = options.srcPath;
    }

    readonly srcPath: string;

    get files() {
        return [this.smithyBuild, this.gradleBuild, this.gradleSettings];
    }
}