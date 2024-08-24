import { Project, SampleFile } from 'projen';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { SmithyProjectCommon } from '../SmithyProjectCommon';

type Template = ReturnType<typeof Handlebars.compile>;
const getTemplate = (): Template => {
    const p = path.join(__dirname, 'sample/service.smithy.handlebars');
    const s = fs.readFileSync(p).toString('utf8');
    return Handlebars.compile(s);
}

const SmithyTemplate = getTemplate();

type ModelSampleFileOptions = {
    modelsDir: string,
    project: SmithyProjectCommon,
    serviceName: string,
    apiVersion: string
}

export class ModelSampleFile extends SampleFile {

    constructor(scope: Project, options: ModelSampleFileOptions) {
        super(scope, path.join(options.modelsDir, `service.smithy`), {
            contents: SmithyTemplate({
                projectGroup: options.project.groupName,
                serviceName: options.serviceName,
                apiVersion: options.apiVersion
            })
        });
    }
}