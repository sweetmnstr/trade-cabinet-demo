import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';

//const { TS } = process.env;
const asyncExec = promisify(exec);

export function rmRfDir(dir: string, leaveDir?: boolean): boolean {
    let files;

    dir = dir + '/';
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        return false;
    }
    if (files.length) {
        for (const x of files) {
            if (fs.statSync(dir + x).isDirectory()) rmRfDir(dir + x);
            else fs.unlinkSync(dir + x);
        }
    }

    if (!leaveDir) {
        // check if user want to delete the directory ir just the files in this directory
        fs.rmdirSync(dir);
    }

    return true;
}

interface UpdaterLogger {
    info(text: any): void;
    warn(text: any): void;
    error(text: any): void;
}

export interface UpdaterConfig {
    intervalSeconds: number; // >60 seconds recommended
    updateCmd: string;
    buildDir: string;
}

export class Updater {
    protected cfg: UpdaterConfig;
    private timer: NodeJS.Timeout | null = null;
    private isUpdatable?: boolean;

    constructor(
        cfg: UpdaterConfig | null,
        protected logger: UpdaterLogger = console,
        protected beforeUpdate?: Function | null,
        protected afterUpdate?: Function | null
    ) {
        if (!cfg) cfg = Updater.getConfig();
        if (cfg.intervalSeconds < 10) {
            throw new Error(`${cfg.intervalSeconds} is not allowed interval. Min 20 seconds`);
        }
        if (!cfg.updateCmd) cfg.updateCmd = 'git pull origin master';

        this.cfg = cfg;
    }

    static getConfig(): UpdaterConfig {
        const { UPDATER_INTERVAL_SECONDS, UPDATER_UPDATE_CMD, UPDATER_BUILD_DIR_PATH } = process.env;

        const cfg = {
            intervalSeconds: (UPDATER_INTERVAL_SECONDS && Number(UPDATER_INTERVAL_SECONDS)) || 120,
            updateCmd: UPDATER_UPDATE_CMD || '',
            buildDir: UPDATER_BUILD_DIR_PATH || './build',
        };

        return cfg;
    }

    public async run() {
        if (this.timer) throw new Error('Already ran!');

        return this.checker();
    }

    private async checker() {
        await this.update();

        this.timer = setTimeout(() => this.checker(), this.cfg.intervalSeconds * 1000);
    }

    private wait(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
    }

    public async update(): Promise<void> {
        try {
            if (this.timer) clearTimeout(this.timer);
            this.logger.info(`Checking for updates...`);

            if (!this.isUpdatable) {
                const updated = await this.getUpdates();

                if (!updated) {
                    this.logger.info(`Up to date.`);
                    return;
                }
            }

            this.logger.warn(`Update found!`);
            if (this.beforeUpdate) await this.beforeUpdate();
            this.logger.warn(`Updating...`);

            await Promise.race([
                this.npmUpdate(),
                this.wait(120e3).then(() => {
                    this.logger.error(`NPM update timed out!`);
                }),
            ]);

            this.logger.warn('Build and migrate...');
            await Promise.all([this.build(), this.migrateUp()]);

            if (this.afterUpdate) await this.afterUpdate();
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * @returns {boolean} updated or not
     */
    public async getUpdates(): Promise<boolean> {
        // NOTE: Do not use stderr of 'git' process
        const { stdout, stderr } = await asyncExec(this.cfg.updateCmd);

        let update = this.checkstdForUpdate(stdout);

        if (update === null) update = this.checkstdForUpdate(stderr);

        if (typeof update === 'boolean') {
            this.isUpdatable = update;
            return update;
        }

        throw new Error(`Update execution:\n${stderr || stdout || 'NO OUTPUT'}`);
    }

    checkstdForUpdate(std: string): boolean | null {
        if (std.replace(/-/g, ' ').startsWith('Already up to date')) return false;
        if (std.startsWith('Updating')) return true;

        return null;
    }

    public migrateUp() {
        return asyncExec(`npm run migrate:run`);
    }

    public npmUpdate() {
        return asyncExec('npm install');
    }

    public build() {
        rmRfDir(this.cfg.buildDir);
        return asyncExec('npm run build');
    }
}
