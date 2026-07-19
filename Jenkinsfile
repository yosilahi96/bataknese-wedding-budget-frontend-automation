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
        // Jenkins "Username with password" credential ID for a valid app login.
        // Create it under Manage Jenkins → Credentials (or folder credentials).
        FE_LOGIN_CREDENTIALS_ID = 'fe-automation-login-valid'
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
                    usernamePassword(
                        credentialsId: "${env.FE_LOGIN_CREDENTIALS_ID}",
                        usernameVariable: 'LOGIN_VALID_EMAIL',
                        passwordVariable: 'LOGIN_VALID_PASSWORD'
                    )
                ]) {
                    sh 'node scripts/prepare-credentials.js'
                    sh 'npm run test:smoke'
                }
            }
        }

        stage('Run UI tests') {
            when {
                expression { return params.RUN_SMOKE_ONLY != true }
            }
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${env.FE_LOGIN_CREDENTIALS_ID}",
                        usernameVariable: 'LOGIN_VALID_EMAIL',
                        passwordVariable: 'LOGIN_VALID_PASSWORD'
                    )
                ]) {
                    sh 'node scripts/prepare-credentials.js'
                    sh 'npm run test:ui'
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
        }
    }
}
