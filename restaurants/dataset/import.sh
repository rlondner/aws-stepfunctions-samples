ATLAS_PRIMARY="%CLUSTER_NAME%-shard-00-00-%SUFFIX%.mongodb.net:27017"
ATLAS_ADMIN="%ATLAS_CLUSTER_ADMIN_USERNAME%"
ATLAS_PWD="%ATLAS_CLUSTER_ADMIN_PASSWORD%"

mongoimport --host $ATLAS_PRIMARY --ssl -u $ATLAS_ADMIN -p $ATLAS_PWD --authenticationDatabase admin --db travel --collection restaurants --drop --file restaurants.json