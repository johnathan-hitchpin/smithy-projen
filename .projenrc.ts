import { cdk } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';
const project = new cdk.JsiiProject({
  author: 'Johnathan',
  authorAddress: 'johnathan@hitchpin.com',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.4.0',
  name: 'smithy-projen',
  projenrcTs: true,
  projenDevDependency: false,
  packageManager: NodePackageManager.PNPM,
  repositoryUrl: 'https://github.com/johnathan/smithy-projen.git',
  eslint: false,
  deps: [
    'projen',
    'constructs'
  ],
});
project.synth();