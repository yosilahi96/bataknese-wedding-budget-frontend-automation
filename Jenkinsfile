pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'RUN_SMOKE_ONLY',
            defaultValue: false,
            description: 'If true, run npm run test:smoke (@smoke). If false, run full npm run test:ui (@ui).'
        )
    }

    tools {
        nodejs 'NodeJS 20'
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    environment {
        BASE_FE_URL = 'https://bataknese-wedding-budget.vercel.app'
        BROWSER = 'chromium'
        HEADLESS = 'true'
        SCREENSHOT = 'only-on-failure'
        VIDEO = 'off'
        TRACE = 'retain-on-failure'
        // Jenkins "Secret file" credential containing credentials_login_valid.json.
        // Create/update under Manage Jenkins → Credentials (or folder credentials).
        FE_LOGIN_FILE_CREDENTIALS_ID = 'fe-valid-login-json'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install chromium'
            }
        }

        stage('Run smoke tests') {
            when {
                expression { return params.RUN_SMOKE_ONLY == true }
            }
            steps {
                withCredentials([
                    file(
                        credentialsId: "${env.FE_LOGIN_FILE_CREDENTIALS_ID}",
                        variable: 'VALID_CREDENTIALS'
                    )
                ]) {
                    sh '''
                        set -e
                        mkdir -p config
                        cp "$VALID_CREDENTIALS" config/credentials_login_valid.json
                        node scripts/prepare-credentials.js
                        npm run test:smoke
                    '''
                }
            }
        }

        stage('Run UI tests') {
            when {
                expression { return params.RUN_SMOKE_ONLY != true }
            }
            steps {
                withCredentials([
                    file(
                        credentialsId: "${env.FE_LOGIN_FILE_CREDENTIALS_ID}",
                        variable: 'VALID_CREDENTIALS'
                    )
                ]) {
                    sh '''
                        set -e
                        mkdir -p config
                        cp "$VALID_CREDENTIALS" config/credentials_login_valid.json
                        node scripts/prepare-credentials.js
                        npm run test:ui
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts(
                artifacts: 'reports/**, test-results/**',
                allowEmptyArchive: true
            )

            publishHTML([
                reportDir: 'reports',
                reportFiles: 'cucumber-report.html',
                reportName: 'Cucumber Test Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])

            // Do not leave login secrets on the agent workspace.
            sh 'rm -f config/credentials_login_valid.json config/credentials_login_invalid.json'
        }
    }
}
