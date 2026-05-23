pipeline {
    agent any

    environment {
        IMAGE_NAME    = 'portfolio'
        GITHUB_USER   = 'PranamyaBS09'
        GITHUB_REPO   = 'devops-portfolio'
        GITHUB_BRANCH = 'main'
    }

    stages {

        stage('Build Docker Image') {
            steps {
                echo '📦 Building Docker image...'
                sh '''
                    docker build --no-cache \
                    -t portfolio:${BUILD_NUMBER} \
                    -t portfolio:latest .
                   
                '''
            }
        }
stage('Deploy to Kubernetes') {
    steps {
        echo '☸️ Deploying to Kubernetes (Minikube)...'
        sh '''
            export KUBECONFIG=/root/.kube/config

            kubectl apply -f k8s/

            kubectl set image deployment/portfolio-deployment \
            portfolio=portfolio:${BUILD_NUMBER}
        '''
    }
}

        stage('Push to GitHub') {
            steps {
                echo '📤 Pushing latest code to GitHub...'

                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_TOKEN'
                )]) {

                    sh '''
                        git config user.email "jenkins@devops.local"
                        git config user.name "Jenkins Bot"

                        git add -A

                        if git diff-index --quiet HEAD --; then
                            echo "No new changes to commit."
                        else
                            git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
                            git push https://${GIT_USER}:${GIT_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git ${GITHUB_BRANCH}
                        fi
                    '''
                }
            }
        }
    }

    post {

        success {
            echo '🎉 Deployment successful!'
        }

        failure {
            echo '❌ Deployment failed'
        }
    }
}