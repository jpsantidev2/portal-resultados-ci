pipeline {
    agent any
    options {
        timestamps()
        timeout(time: 12, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
        disableConcurrentBuilds(abortPrevious: true)
    }
    stages {
        stage('1. Sincronizar código') {
            steps {
                checkout scm
                sh 'git status --short'
            }
        }
        stage('2. Diagnosticar ambiente') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }
    }
}
