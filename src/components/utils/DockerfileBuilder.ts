
export class DockerfileBuilder {
    private readonly fromLine: string;
    private readonly copyFileLines: string[] = [];
    private readonly runLines: string[] = [];
    private readonly copyOutputLines: string[] = [];

    constructor(initialImage: string, platform?: string) {
        if (platform) {
            this.fromLine = `FROM --platform ${platform!} ${initialImage} AS builder`;
        } else {
            this.fromLine = `FROM ${initialImage} AS builder`;
        }
    }

    copy(from: string, to: string) {
        this.copyFileLines.push(`COPY ${from} ${to}`);
    }

    run(command: string) {
        this.runLines.push(`RUN ${command}`);
    }

    runGradle(gradleCmd: string) {
        this.run(`gradle ${gradleCmd}`);
    }

    artifact(from: string, artifactName: string) {
        if (this.copyOutputLines.length === 0) {
            this.copyOutputLines.push('RUN mkdir outputs');
        }
        this.copyOutputLines.push(`RUN mv ${from} ${artifactName}`);
    }

    toDockerfile(destPath: string): string {
        const lines: string[] = [
            this.fromLine,
            ...this.copyFileLines,
            ...this.runLines,
            ...this.copyOutputLines,
            'FROM scratch',
            `COPY --from=builder /home/gradle/outputs ${destPath}`
        ];
        return lines.join('\n');
    }
}