import { ProjectOptions } from '@vue/cli-service';

const REPO_NAME = 'hofladen';

const config: ProjectOptions = {
    publicPath: process.env.NODE_ENV === 'production'
        ? (process.env.VUE_APP_BRANCH === 'dev' ? `/${REPO_NAME}/dev/` : `/${REPO_NAME}/`)
        : '/', // <-- Dies ist für die lokale Entwicklung (NODE_ENV ist 'development')
};

export default config;