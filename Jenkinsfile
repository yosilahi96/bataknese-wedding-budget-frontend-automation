pipeline {
    agent any

    parameters {
        booleanParam(
            name: 'RUN_SMOKE_ONLY',
            defaultValue: false,
            description: 'If true, run npm run test:smoke (@smoke). If false, run full npm run test:ui (@ui).'
        )
        string(
            name: 'LOGIN_USERPASS_CREDENTIALS_ID',
            defaultValue: 'fe-automation-login-valid',
            description: 'Jenkins "Username with password" credential ID (email + password).'
        )
        string(
            name: 'LOGIN_FILE_CREDENTIALS_ID',
            defaultValue: 'fe-valid-login-json',
            description: 'Jenkins "Secret file" credential ID (credentials_login_valid.json contents).'
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
                script {
                    runAuthenticatedTests('npm run test:smoke')
                }
            }
        }

        stage('Run UI tests') {
            when {
                expression { return params.RUN_SMOKE_ONLY != true }
            }
            steps {
                script {
                    runAuthenticatedTests('npm run test:ui')
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
            sh 'rm -f config/credentials_login_valid.json config/credentials_login_invalid.json || true'
        }
    }
}

/**
 * Resolve login credentials from the first available source, then run tests.
 *
 * Order:
 *  1. Username/password credential (LOGIN_USERPASS_CREDENTIALS_ID)
 *  2. Secret file credential (LOGIN_FILE_CREDENTIALS_ID)
 *  3. Env LOGIN_VALID_EMAIL / LOGIN_VALID_PASSWORD already present on the job/agent
 *
 * Credential-not-found errors fall through to the next source.
 * Real test failures are rethrown and fail the build.
 */
def runAuthenticatedTests(String testCommand) {
    def userPassId = params.LOGIN_USERPASS_CREDENTIALS_ID?.trim()
    def fileId = params.LOGIN_FILE_CREDENTIALS_ID?.trim()
    def attempts = []

    if (userPassId) {
        def result = tryRunWithUserPass(userPassId, testCommand)
        if (result == 'ok') {
            return
        }
        if (result == 'test-failed') {
            error "UI tests failed while using username/password credential '${userPassId}'."
        }
        attempts << "usernamePassword '${userPassId}': not found or unusable"
    }

    if (fileId) {
        def result = tryRunWithSecretFile(fileId, testCommand)
        if (result == 'ok') {
            return
        }
        if (result == 'test-failed') {
            error "UI tests failed while using secret file credential '${fileId}'."
        }
        attempts << "secret file '${fileId}': not found or unusable"
    }

    // Job/agent env already injected (no withCredentials needed).
    if (env.LOGIN_VALID_EMAIL?.trim() && env.LOGIN_VALID_PASSWORD?.trim()) {
        echo 'Using LOGIN_VALID_EMAIL / LOGIN_VALID_PASSWORD from the job/agent environment'
        sh """
            set -e
            mkdir -p config
            node scripts/prepare-credentials.js
            ${testCommand}
        """
        return
    }

    attempts << 'env LOGIN_VALID_EMAIL/LOGIN_VALID_PASSWORD: not set'

    error """No login credentials available for CI.

Tried:
  - ${attempts.join('\n  - ')}

Create ONE of these in Jenkins (Manage Jenkins → Credentials → System → Global credentials → Add Credentials),
then re-run the job:

Option A — Username with password (recommended)
  Kind: Username with password
  ID:   ${userPassId ?: 'fe-automation-login-valid'}
  Username: your app login email
  Password: your app login password

Option B — Secret file
  Kind: Secret file
  ID:   ${fileId ?: 'fe-valid-login-json'}
  File: JSON shaped like:
        {"validUser":{"email":"you@example.com","password":"your-password"}}

Option C — Job environment variables
  Set LOGIN_VALID_EMAIL and LOGIN_VALID_PASSWORD on the job/agent
  (or bind a credential to those variable names in the job config).
"""
}

def isMissingCredentialError(Throwable err) {
    def msg = "${err}"
    def causeMsg = err?.cause ? "${err.cause}" : ''
    def combined = (msg + ' ' + causeMsg).toLowerCase()

    return combined.contains('could not find credentials') ||
        combined.contains('credentialnotfound') ||
        combined.contains('credentials entry') ||
        (combined.contains('credentials') && combined.contains('not found'))
}

/**
 * @return 'ok' | 'missing-credential' | 'test-failed'
 */
def tryRunWithUserPass(String credentialsId, String testCommand) {
    try {
        echo "Trying username/password credentials: ${credentialsId}"
        withCredentials([
            usernamePassword(
                credentialsId: credentialsId,
                usernameVariable: 'LOGIN_VALID_EMAIL',
                passwordVariable: 'LOGIN_VALID_PASSWORD'
            )
        ]) {
            sh """
                set -e
                mkdir -p config
                node scripts/prepare-credentials.js
                ${testCommand}
            """
        }
        return 'ok'
    } catch (err) {
        if (isMissingCredentialError(err)) {
            echo "username/password credential unavailable: ${err}"
            return 'missing-credential'
        }
        echo "Test run failed with username/password credential '${credentialsId}': ${err}"
        return 'test-failed'
    }
}

/**
 * @return 'ok' | 'missing-credential' | 'test-failed'
 */
def tryRunWithSecretFile(String credentialsId, String testCommand) {
    try {
        echo "Trying secret file credentials: ${credentialsId}"
        withCredentials([
            file(
                credentialsId: credentialsId,
                variable: 'VALID_CREDENTIALS'
            )
        ]) {
            sh """
                set -e
                mkdir -p config
                cp "\$VALID_CREDENTIALS" config/credentials_login_valid.json
                node scripts/prepare-credentials.js
                ${testCommand}
            """
        }
        return 'ok'
    } catch (err) {
        if (isMissingCredentialError(err)) {
            echo "secret file credential unavailable: ${err}"
            return 'missing-credential'
        }
        echo "Test run failed with secret file credential '${credentialsId}': ${err}"
        return 'test-failed'
    }
}
