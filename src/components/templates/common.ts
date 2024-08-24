import { Component, FileBase } from "projen";

export type SmithyOptions = {
    smithyVersion: string,
    smithyCliVersion: string,
    smithyPluginVersion: string,
}

export abstract class SmithyFiles extends Component {

    abstract get srcPath(): string;
    abstract get files(): FileBase[];
}