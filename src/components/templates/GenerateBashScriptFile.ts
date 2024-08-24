import { TextFile } from 'projen';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { IConstruct } from 'constructs';

type Template = ReturnType<typeof Handlebars.compile>;
const getTemplate = (): Template => {
    const p = path.join(__dirname, 'generate-bash-script.sh');
    const s = fs.readFileSync(p).toString('utf8');
    return Handlebars.compile(s);
}

const generateTemplate = getTemplate();

type GenerateBashScriptFileOptions = {
    modelsDir: string,

}

export class GenerateBashScriptFile extends TextFile {
    constructor(scope: IConstruct, options: GenerateBashScriptFileOptions) {
        super(scope, `scripts/generate.sh`, {
            lines: generateTemplate({
                ...options
            }).split('\n')
        });
    }
}