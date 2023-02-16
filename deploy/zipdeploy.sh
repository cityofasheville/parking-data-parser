echo "Packaging function as zip..."
rm -f function.zip
cd ..
pushd node_modules
zip -r9q ../deploy/function.zip .
popd
zip -gq ./deploy/function.zip ./*.js package.json
cd deploy
echo "send it"
# terraform apply -auto-approve -var-file=ca.tfvars
terraform apply -var-file=ca.tfvars 