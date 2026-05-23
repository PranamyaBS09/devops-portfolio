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
                echo '☸️ Deploying to Kubernetes...'
                sh '''
                    export KUBECONFIG=$HOME/.kube/config

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
            echo '🎉 Kubernetes deployment successful!'

            catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {

                withCredentials([string(
                    credentialsId: 'discord-webhook',
                    variable: 'DISCORD_WEBHOOK'
                )]) {

                    sh '''
                        COMMIT_MSG=$(git log -1 --pretty=%B | tr -d '\\n' | tr -d '"')

                        curl -H "Content-Type: application/json" \
                        -X POST \
                        -d "{
                            \\"embeds\\":[{
                                \\"title\\":\\"🟢 Kubernetes Deployment Success\\",
                                \\"description\\":\\"Portfolio deployed using Jenkins + Docker + Kubernetes 🚀\\",
                                \\"color\\":3066993,
                                \\"fields\\":[
                                    {
                                        \\"name\\":\\"Latest Commit\\",
                                        \\"value\\":\\"${COMMIT_MSG}\\"
                                    },
                                    {
                                        \\"name\\":\\"Status\\",
                                        \\"value\\":\\"Running on Minikube ☸️\\"
                                    }
                                ]
                            }]
                        }" \
                        $DISCORD_WEBHOOK
                    '''
                }
            }
        }

        failure {
            echo '❌ Deployment failed'

            catchError(buildResult: 'FAILURE', stageResult: 'SUCCESS') {

                withCredentials([string(
                    credentialsId: 'discord-webhook',
                    variable: 'DISCORD_WEBHOOK'
                )]) {

                    sh '''
                        curl -H "Content-Type: application/json" \
                        -X POST \
                        -d "{
                            \\"embeds\\":[{
                                \\"title\\":\\"🔴 Build Failed\\",
                                \\"description\\":\\"Jenkins pipeline failed. Check logs.\\",
                                \\"color\\":15158332
                            }]
                        }" \
                        $DISCORD_WEBHOOK
                    '''
                }
            }
        }
    }
}