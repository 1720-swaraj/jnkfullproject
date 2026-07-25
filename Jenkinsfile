pipeline {
    agent any

    tools {
        git 'git'
        maven 'maven'
    }
    environment {
        DEPLOY_DIR = '/var/www/janlok-demo'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy Frontend') {
            steps {
                sh """
                    rm -rf ${DEPLOY_DIR}/*
                    cp -r frontend/dist/* ${DEPLOY_DIR}/
                """
            }
        }

    }

    post {
        success {
            echo '✅ Build completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs above.'
        }
    }
}