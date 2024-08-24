import { DockerfileBuilder } from "./utils";
import * as path from 'path';

type SrcMapping = {
    from: string,
    to: string
}
export abstract class SmithyDockerPhase {
    abstract copySrc(builder: DockerfileBuilder): void;
    abstract execGradle(builder: DockerfileBuilder): void;
    abstract copyArtifacts(builder: DockerfileBuilder): void;
}

type ModelPhaseOptions = {
    srcDir: string,
    outDir: string
}
export class ModelPhase extends SmithyDockerPhase {

    private readonly projectDir: string;
    constructor(private readonly options: ModelPhaseOptions) {
        super();
        this.projectDir = path.dirname(path.relative('./src', options.srcDir));
    }

    copySrc(builder: DockerfileBuilder): void {
        builder.copy(this.options.srcDir, './src');
    }

    execGradle(builder: DockerfileBuilder): void {
        builder.runGradle(':model:build');
    }

    copyArtifacts(builder: DockerfileBuilder): void {
    }
}

type TypeScriptServerPhaseOptions = {
    srcDir: string,
    outDir: string,
    projectName: string
}
export class TypeScriptServerPhase extends SmithyDockerPhase {

    private readonly projectDir: string;
    constructor(private readonly options: TypeScriptServerPhaseOptions) {
        super();
        this.projectDir = path.dirname(path.relative('./src', options.srcDir));
    }

    copySrc(builder: DockerfileBuilder): void {
        builder.copy(this.options.srcDir, './src');
    }

    execGradle(builder: DockerfileBuilder): void {
        builder.runGradle(`:${this.options.projectName}:build`);
    }

    copyArtifacts(builder: DockerfileBuilder): void {
        builder.artifact(`./${this.projectDir}/build/smithyprojections/${this.options.projectName}/ts-server/typescript-ssdk-codegen`, this.options.outDir);
    }
}

type TypeScriptClientPhaseOptions = {
    srcDir: string,
    outDir: string,
    projectName: string
}
export class TypeScriptClientPhase extends SmithyDockerPhase {

    private readonly projectDir: string;
    constructor(private readonly options: TypeScriptClientPhaseOptions) {
        super();
        this.projectDir = path.dirname(path.relative('./src', options.srcDir));
    }

    copySrc(builder: DockerfileBuilder): void {
        builder.copy(this.options.srcDir, './src');
    }

    execGradle(builder: DockerfileBuilder): void {
        builder.runGradle(`:${this.options.projectName}:build`);
    }

    copyArtifacts(builder: DockerfileBuilder): void {
        builder.artifact(`./${this.projectDir}/build/smithyprojections/${this.options.projectName}/ts-client/typescript-codegen`, this.options.outDir);
    }
}