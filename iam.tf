# Data resources for managed AWS policies
data "aws_iam_policy" "AmazonEKSServiceRolePolicy" {
  name = "AmazonEKSServiceRolePolicy"
}

data "aws_iam_policy" "AmazonEKSClusterPolicy" {
  name = "AmazonEKSClusterPolicy"
}

data "aws_iam_policy" "AmazonEKSVPCResourceController" {
  name = "AmazonEKSVPCResourceController"
}

# EKS Cluster Role
resource "aws_iam_role" "EKS_Cluster_Role" {
  name = "EKS_Cluster_Role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

# Policy attachments for EKS Cluster Role
resource "aws_iam_policy_attachment" "AmazonEKSServiceRolePolicy_attachment" {
  name       = "AmazonEKSServiceRolePolicy_attachment"
  policy_arn = data.aws_iam_policy.AmazonEKSServiceRolePolicy.arn
  roles      = [aws_iam_role.EKS_Cluster_Role.name]
}

resource "aws_iam_policy_attachment" "AmazonEKSClusterPolicy_attachment" {
  name       = "AmazonEKSClusterPolicy_attachment"
  policy_arn = data.aws_iam_policy.AmazonEKSClusterPolicy.arn
  roles      = [aws_iam_role.EKS_Cluster_Role.name]
}

resource "aws_iam_policy_attachment" "AmazonEKSVPCResourceController_attachment" {
  name       = "AmazonEKSVPCResourceController_attachment"
  policy_arn = data.aws_iam_policy.AmazonEKSVPCResourceController.arn
  roles      = [aws_iam_role.EKS_Cluster_Role.name]
}

# EKS Worker Node IAM Policies
data "aws_iam_policy" "AmazonEKSWorkerNodePolicy" {
  name = "AmazonEKSWorkerNodePolicy"
}

data "aws_iam_policy" "AmazonEC2ContainerRegistryReadOnly" {
  name = "AmazonEC2ContainerRegistryReadOnly"
}

data "aws_iam_policy" "AmazonEKS_CNI_Policy" {
  name = "AmazonEKS_CNI_Policy"
}

# Custom EBS policy for EKS Nodes
resource "aws_iam_policy" "create_delete_ebs_policy" {
  name        = "create_delete_ebs_policy"
  description = "Allows EKS nodes to create and delete EBS volumes"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateVolume",
          "ec2:DeleteVolume",
          "ec2:DescribeVolumes",
          "ec2:AttachVolume",
          "ec2:DetachVolume",
          "ec2:CreateTags"
        ]
        Resource = "*"
      }
    ]
  })
}

# EKS Worker Node Role
resource "aws_iam_role" "AmazonEKSNodeRole" {
  name = "AmazonEKSNodeRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Policy attachments for EKS Worker Node Role
resource "aws_iam_policy_attachment" "AmazonEKSWorkerNodePolicy_attachment" {
  name       = "AmazonEKSWorkerNodePolicy_attachment"
  policy_arn = data.aws_iam_policy.AmazonEKSWorkerNodePolicy.arn
  roles      = [aws_iam_role.AmazonEKSNodeRole.name]
}

resource "aws_iam_policy_attachment" "AmazonEC2ContainerRegistryReadOnly_attachment" {
  name       = "AmazonEC2ContainerRegistryReadOnly_attachment"
  policy_arn = data.aws_iam_policy.AmazonEC2ContainerRegistryReadOnly.arn
  roles      = [aws_iam_role.AmazonEKSNodeRole.name]
}

resource "aws_iam_policy_attachment" "AmazonEKS_CNI_Policy_attachment" {
  name       = "AmazonEKS_CNI_Policy_attachment"
  policy_arn = data.aws_iam_policy.AmazonEKS_CNI_Policy.arn
  roles      = [aws_iam_role.AmazonEKSNodeRole.name]
}

resource "aws_iam_policy_attachment" "eks_nodegroup_attachment" {
  name       = "eks_nodegroup_attachment"
  policy_arn = aws_iam_policy.create_delete_ebs_policy.arn
  roles      = [aws_iam_role.AmazonEKSNodeRole.name]
}
