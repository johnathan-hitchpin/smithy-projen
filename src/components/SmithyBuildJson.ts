import { Project, SampleFile } from "projen";

export type SmithyBuildJsonOptions = {
    version?: string;
}

export class SmithyBuildJson extends SampleFile {
    constructor(scope: Project, options?: SmithyBuildJsonOptions) {
      super(scope, "smithy-build.json", {
        contents: createJson(options)
      });
    }
  }

  const createJson = (options?: SmithyBuildJsonOptions): string => {
    const v = options?.version ?? '1.0';
    return JSON.stringify({
        version: v
    });
  }