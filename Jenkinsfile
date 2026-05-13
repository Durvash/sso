pipeline {
    agent any

    environment {

        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '983491056516'

        IMAGE_REPO = 'sso-app'

        IMAGE_TAG = "${BUILD_NUMBER}"

        IMAGE_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_REPO}:${IMAGE_TAG}"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Durvash/sso.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t sso-app .'
            }
        }

        stage('AWS ECR Login') {

            steps {

                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-ecr-creds'
                ]]) {

                    sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login \
                    --username AWS \
                    --password-stdin \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh 'docker tag sso-app:latest $IMAGE_URI'
            }
        }

        stage('Push Image To ECR') {
            steps {
                sh 'docker push $IMAGE_URI'
            }
        }

        stage('Deploy Docker Container') {

            steps {

                sh '''
                docker pull $IMAGE_URI

                docker stop sso-app || true

                docker rm sso-app || true

                docker run -d \
                    --name sso-app \
                    -p 5000:5000 \
                    --restart always \
                    $IMAGE_URI
                '''
            }
        }
    }
}
