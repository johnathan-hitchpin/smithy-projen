import { IConstruct } from "constructs";
import { Component, JsonFile, TextFile } from "projen";
import { SmithyFiles, type SmithyOptions } from "./common";
import type { SmithyProjectCommon } from '../SmithyProjectCommon';
import Handlebars from "handlebars";
import * as path from 'path';
import * as fs from 'fs';

type HbTemplate = ReturnType<typeof Handlebars.compile>;
type TsServerTemplate = 'smithy-build.json' | 'build.gradle' | 'settings.gradle';
const getTemplate = (name: TsServerTemplate): HbTemplate => {
    const p = path.join(__dirname, 'ts-server/' + name);
    const str = fs.readFileSync(p).toString('utf8');
    return Handlebars.compile(str);
}


const sbJsonTemplate = getTemplate('smithy-build.json');
const buildGradleTemplate = getTemplate('build.gradle');
const settingsGradleTemplate = getTemplate('settings.gradle');

type TsServerSmithyBuildJsonFileOptions = {
    path: string,
    tsServerOutputDirectory: string,
    tsServerPackageName: string,
    tsServerPackageSemver: string
}
export class TsServerSmithyBuildJsonFile extends JsonFile {
    constructor(scope: IConstruct, options: TsServerSmithyBuildJsonFileOptions) {
        super(scope, `${options.path}/smithy-build.json`, {
            obj: JSON.parse(sbJsonTemplate({
                ...options
            }))
        });
    }
}

type TsServerBuildGradleFileOptions = SmithyProjectCommon & SmithyOptions & {
    path: string,
    smithyTypescriptCodegenVersion: string
}
export class TsServerBuildGradleFile extends TextFile {
    constructor(scope: IConstruct, options: TsServerBuildGradleFileOptions) {
        super(scope, `${options.path}/build.gradle`, {
            lines: buildGradleTemplate({
                ...options
            }).split('\n')
        });
    }
}

type TsServerSettingsGradleFileOptions = {
    path: string,
    tsServerProjectName: string
}
export class TsServerSettingsGradleFile extends TextFile {
    constructor(scope: IConstruct, options: TsServerSettingsGradleFileOptions) {
        super(scope, `${options.path}/settings.gradle`, {
            lines: settingsGradleTemplate({
                ...options
            }).split('\n')
        });
    }
}

type TsServerFilesOptions = {
    projectName: string,
    srcPath: string,
    outputDirectory: string,
    packageName: string,
    packageSemver: string,
    typescriptCodegenVersion: string,
    smithy: SmithyOptions,
    project: SmithyProjectCommon
}

export class TsServerFiles extends SmithyFiles {

    public readonly smithyBuild: TsServerSmithyBuildJsonFile;
    public readonly gradleBuild: TsServerBuildGradleFile;
    public readonly gradleSettings: TsServerSettingsGradleFile;

    constructor(scope: IConstruct, options: TsServerFilesOptions) {
        super(scope);

        this.smithyBuild = new TsServerSmithyBuildJsonFile(this, {
            path: options.srcPath,
            tsServerOutputDirectory: options.outputDirectory,
            tsServerPackageName: options.packageName,
            tsServerPackageSemver: options.packageSemver,
            ...options.smithy
        });
        this.gradleBuild = new TsServerBuildGradleFile(this, {
            path: options.srcPath,
            ...options.smithy,
            ...options.project,
            smithyTypescriptCodegenVersion: options.typescriptCodegenVersion
        });
        this.gradleSettings = new TsServerSettingsGradleFile(this, {
            path: options.srcPath,
            tsServerProjectName: options.projectName
        });

        this.srcPath = options.srcPath;
    }

    readonly srcPath: string;

    get files() {
        return [
            this.smithyBuild,
            this.gradleBuild,
            this.gradleSettings
        ];
    }
}