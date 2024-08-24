import { Project, FileBase, IResolver, typescript } from "projen";
import { IConstruct } from 'constructs';
import * as utils from './utils';
import * as path from 'path';
import { SmithyDockerPhase } from "./SmithyDockerPhase";

const DefaultBaseImage = 'public.ecr.aws/docker/library/gradle:jdk17-focal';

export type SmithyDockerfileOptions = {
    modelsDir: string,
    outDir: string,
    baseImage?: string,
    platform?: string
}

export class SmithyDockerfile extends FileBase {

  #phases: SmithyDockerPhase[] = [];
    readonly #options: SmithyDockerfileOptions;

    get phases(): SmithyDockerPhase[] {
      return this.#phases;
    }
    set phases(value: SmithyDockerPhase[]) {
        this.#phases = value;
    }

    public constructor(scope: IConstruct, options: SmithyDockerfileOptions) {
      super(scope, "Dockerfile", {
        readonly: true,
        executable: false,
      });
      this.#options = {
        ...options,
        baseImage: options.baseImage ?? DefaultBaseImage
      };
    }
    protected synthesizeContent(_: IResolver): string | undefined {
        const b = new utils.DockerfileBuilder(this.#options.baseImage!, this.#options.platform);
        b.copy('./src', './');
        b.copy("'" + path.join(this.#options.modelsDir, '**/*') + "'", './model/src');
        this.#phases.forEach(phase => {
          phase.copySrc(b);
        });
        
        b.runGradle('clean');
        b.runGradle(':model:build');

        this.#phases.forEach(phase => {
          phase.execGradle(b);
        });

        this.#phases.forEach(phase => {
          phase.copyArtifacts(b);
        });
        return b.toDockerfile(this.#options.outDir);
    }
  }
