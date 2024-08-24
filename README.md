## eks-demo

This Repo consists of Infra creation, frontend, backend, monitoring on aws using terraform


## Steps:

1. Check the Terraform Plan  > if plan is ok then proceed 
2. Run terraform apply workflow to create the infra.
3. After creating execute below command to connect to the cluster
``aws eks --region ap-south-1 update-kubeconfig --name webapp``
4. Check nodes are up or not 
``kubectl get no``
