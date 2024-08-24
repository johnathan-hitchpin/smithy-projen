import { IConstruct } from "constructs";
import { Component, JsonFile, TextFile } from "projen";
import { SmithyFiles, type SmithyOptions } from "./common";
import type { SmithyProjectCommon } from '../SmithyProjectCommon';
import Handlebars from "handlebars";
import * as path from 'path';
import * as fs from 'fs';

type HbTemplate = ReturnType<typeof Handlebars.compile>;
type OpenApiTemplate = 'smithy-build.json' | 'build.gradle' | 'settings.gradle';
const getTemplate = (name: OpenApiTemplate): HbTemplate => {
    const p = path.join(__dirname, 'openapi/' + name);
    const str = fs.readFileSync(p).toString('utf8');
    return Handlebars.compile(str);
}


const sbJsonTemplate = getTemplate('smithy-build.json');
const buildGradleTemplate = getTemplate('build.gradle');
const settingsGradleTemplate = getTemplate('settings.gradle');

type OpenApiSmithyBuildJsonFileOptions = {
    path: string
    openApiOutputDirectory: string,
    openApiTargetService: string,
    openApiProtocol: string
}
export class OpenApiSmithyBuildJsonFile extends JsonFile {
    constructor(scope: IConstruct, options: OpenApiSmithyBuildJsonFileOptions) {
        super(scope, `${options.path}/smithy-build.json`, {
            obj: JSON.parse(sbJsonTemplate({
                ...options
            }))
        });
    }
}

type OpenApiBuildGradleFileOptions = SmithyProjectCommon & SmithyOptions & {
    path: string
}
export class OpenApiBuildGradleFile extends TextFile {
    constructor(scope: IConstruct, options: OpenApiBuildGradleFileOptions) {
        super(scope, `${options.path}/build.gradle`, {
            lines: buildGradleTemplate({
                ...options
            }).split('\n')
        });
    }
}

type OpenApiSettingsGradleFileOptions = {
    openApiProjectName: string,
    path: string
}
export class OpenApiSettingsGradleFile extends TextFile {
    constructor(scope: IConstruct, options: OpenApiSettingsGradleFileOptions) {
        super(scope, `${options.path}/settings.gradle`, {
            lines: settingsGradleTemplate({
                ...options
            }).split('\n')
        });
    }
}

type OpenApiFilesOptions = {
    projectName: string,
    srcPath: string,
    outputDirectory: string,
    targetService: string,
    protocol: string,
    smithy: SmithyOptions,
    project: SmithyProjectCommon
}

export class OpenApiFiles extends SmithyFiles {

    public readonly smithyBuild: OpenApiSmithyBuildJsonFile;
    public readonly gradleBuild: OpenApiBuildGradleFile;
    public readonly gradleSettings: OpenApiSettingsGradleFile;

    constructor(scope: IConstruct, options: OpenApiFilesOptions) {
        super(scope);

        this.smithyBuild = new OpenApiSmithyBuildJsonFile(this, {
            path: options.srcPath,
            openApiOutputDirectory: options.outputDirectory,
            openApiTargetService: options.targetService,
            openApiProtocol: options.protocol,
            ...options.smithy
        });
        this.gradleBuild = new OpenApiBuildGradleFile(this, {
            path: options.srcPath,
            ...options.smithy,
            ...options.project
        });
        this.gradleSettings = new OpenApiSettingsGradleFile(this, {
            path: options.srcPath,
            openApiProjectName: options.projectName
        });

        this.srcPath = options.srcPath;
    }

    readonly srcPath: string;

    get files() {
        return [
            this.smithyBuild,
            this.gradleBuild,
            this.gradleSettings
        ]
    }
}