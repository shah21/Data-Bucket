import aws from "aws-sdk";
import 'dotenv/config'

aws.config.update({region:'us-east-2'});
export default aws;

