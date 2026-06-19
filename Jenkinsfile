pipeline {
    agent any

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

        stage('Run UI tests') {
            steps {
                sh 'npm run test:ui'
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
