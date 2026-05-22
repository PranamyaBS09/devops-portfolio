# Custom Jenkins image — includes Docker CLI, Git and kubectl
FROM jenkins/jenkins:lts

USER root

# Install Docker CLI, Git and curl
RUN apt-get update && \
    apt-get install -y docker.io git curl && \
    rm -rf /var/lib/apt/lists/*

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    rm kubectl

# Allow Jenkins user to run Docker commands
RUN usermod -aG docker jenkins

USER jenkins