import { IConstruct } from "constructs";
import { Component } from "projen";
import { SmithyDockerPhase } from "./SmithyDockerPhase";
import * as templates from "./templates";
import type * as tt from './templates';
import type { SmithyProjectCommon } from './SmithyProjectCommon';

export abstract class SmithyTarget extends Component {
    constructor(scope: IConstruct) {
        super(scope);
    }

    abstract get phases(): SmithyDockerPhase[];
    abstract get files(): templates.SmithyFiles;
}