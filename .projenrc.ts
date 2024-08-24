import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'Johnathan',
  authorAddress: 'johnathan@hitchpin.com',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.4.0',
  name: 'smithy-projen',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/johnathan/smithy-projen.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();