import { TypeScriptProject, TypeScriptProjectOptions } from 'projen/lib/typescript';
import * as components from './components';
import type * as t from './components';

export interface SmithyProjectOptions extends TypeScriptProjectOptions {
  smithyBuild?: t.SmithyBuildJsonOptions,
  modelDir?: string,
  smithy?: t.SmithyOptions,
  srcDir?: string,
  maven: t.SmithyProjectCommon
}

export class SmithyProject extends TypeScriptProject {

  private readonly options: SmithyProjectOptions;

  public readonly smithyBuildJson: components.SmithyBuildJson;
  public readonly targets: components.SmithyTarget[] = [];

  public readonly dockerfile: components.SmithyDockerfile;

  constructor(options: SmithyProjectOptions) {
    super(options);

    this.smithyBuildJson = new components.SmithyBuildJson(this, options.smithyBuild);
    this.dockerfile = new components.SmithyDockerfile(this, {
      modelsDir: options.modelDir ?? 'models',
      outDir: options.outdir ?? 'dist',
    });
    this.options = options;
  }

  preSynthesize(): void {
    this.dockerfile.phases = this.targets.flatMap(t => t.phases);
    super.preSynthesize();
  }

  addOpenApiTarget = (options: Omit<t.SmithyOpenApiTargetOptions, 'smithy' | 'project'>): components.SmithyOpenApiTarget => {
    const tgt = new components.SmithyOpenApiTarget(this, {
      ...options,
      smithy: this.options.smithy,
      project: this.options.maven
    });
    this.targets.push(tgt);
    return tgt;
  }

  addTsClientTarget = (options: Omit<t.SmithyTsClientTargetOptions, 'smithy' | 'project'>): components.SmithyTsClientTarget => {
    const tgt = new components.SmithyTsClientTarget(this, {
      ...options,
      smithy: this.options.smithy,
      project: this.options.maven
    });
    this.targets.push(tgt);
    return tgt;
  }

  addTsServerTarget = (options: Omit<t.SmithyTsServerTargetOptions, 'smithy' | 'project'>): components.SmithyTsServerTarget => {
    const tgt = new components.SmithyTsServerTarget(this, {
      ...options,
      smithy: this.options.smithy,
      project: this.options.maven
    });
    this.targets.push(tgt);
    return tgt;
  }
}