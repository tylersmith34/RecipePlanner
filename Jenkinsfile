pipeline {
  agent any
  stages {
    stage('') {
      steps {
        parallel(
          "Test": {
            echo 'step 1'
            echo 'step 3'
            
          },
          "Test 2": {
            echo 'step 2'
            echo 'Test 2 tries again'
            
          },
          "": {
            echo 'Test 3'
            
          }
        )
      }
    }
    stage('Stage') {
      steps {
        echo 'Test 4 - stage'
      }
    }
    stage('All Done') {
      steps {
        echo 'Done'
      }
    }
  }
  environment {
    manifestFileName = 'manifest.yaml'
  }
}