ATLAS_USERNAME="<username>"
ATLAS_PASSWORD="<password>"
ATLAS_CLUSTER_NAME="<cluster_name>"
ATLAS_CLUSTER_SUFFIX="<cluster_suffix>"
DATABASE_NAME="travel"

ATLAS_URI="\"mongodb://$ATLAS_USERNAME:$ATLAS_PASSWORD@$ATLAS_CLUSTER_NAME-shard-00-00-$ATLAS_CLUSTER_SUFFIX.mongodb.net:27017,$ATLAS_CLUSTER_NAME-shard-00-01-$ATLAS_CLUSTER_SUFFIX.mongodb.net:27017,$ATLAS_CLUSTER_NAME-shard-00-02-$ATLAS_CLUSTER_SUFFIX.mongodb.net:27017/$DATABASE_NAME?ssl=true&replicaSet=$ATLAS_CLUSTER_NAME-shard-0&authSource=admin\""

#echo $ATLAS_URI
lambda-local -l index.js -e event.json -E {\"MONGODB_ATLAS_CLUSTER_URI\":$ATLAS_URI}
