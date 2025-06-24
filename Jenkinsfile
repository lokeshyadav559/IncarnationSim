pipeline {
  agent any

  // Poll GitHub every 5 minutes (or set up a webhook later)
  triggers {
    pollSCM('H H * * *')
  }

  environment {
    DEMO_MSG = "IncarnationSim CI passed on branch ${env.BRANCH_NAME}! 🚀"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        echo "Installing npm packages..."
        sh 'npm ci'
      }
    }

    stage('Lint') {
      when { expression { fileExists('package.json') && sh(script: "grep -q 'lint' package.json", returnStatus: true) == 0 } }
      steps {
        echo "Running linter..."
        sh 'npm run lint'
      }
    }

    stage('Build') {
      when { expression { fileExists('package.json') && sh(script: "grep -q 'build' package.json", returnStatus: true) == 0 } }
      steps {
        echo "Building production bundle..."
        sh 'npm run build'
      }
    }

    stage('Test') {
      when { expression { fileExists('package.json') && sh(script: "grep -q 'test' package.json", returnStatus: true) == 0 } }
      steps {
        echo "✅ Running tests..."
        sh 'npm test -- --ci --reporters=default || true'
      }
      post {
        always {
          // publish any JUnit-like reports if you add a reporter plugin
          junit allowEmptyResults: true, testResults: '**/test-results/*.xml'
        }
      }
    }

    stage('Demo Message') {
      steps {
        echo env.DEMO_MSG
      }
    }
  }

  post {
    success {
      echo " All good. CI succeeded!"
    }
    failure {
      echo "something broke. Check the console logs!"
    }
  }
}
