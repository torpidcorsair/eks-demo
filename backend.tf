terraform {
  backend "s3" {
    bucket = "demo-app-tf-backend-bucket-new"
    key    = "k8s_webapp_tf_state_file.tfstate"
    region = "ap-south-1"
  }
}
