#!/bin/sh
<%_ if (prodDatabaseType == 'mysql') { _%>
################################################################################
# MySQL
################################################################################
if [ -d ${SPRING_DATASOURCE_URL} ]; then
  SPRING_DATASOURCE_URL="jdbc:mysql://${MYSQL_PORT_3306_TCP_ADDR}:${MYSQL_PORT_3306_TCP_PORT}/<%=baseName%>?useUnicode=true&characterEncoding=utf8"
  echo "SPRING_DATASOURCE_URL autoconfigured by docker link: ${SPRING_DATASOURCE_URL}"
else
  echo "SPRING_DATASOURCE_URL init by configuration: ${SPRING_DATASOURCE_URL}"
fi
<%_ } if (prodDatabaseType == 'postgresql') { _%>
################################################################################
# PostgreSQL
################################################################################
if [ -d ${SPRING_DATASOURCE_URL} ]; then
  SPRING_DATASOURCE_URL="jdbc:postgresql://${POSTGRESQL_PORT_5432_TCP_ADDR}:${POSTGRESQL_PORT_5432_TCP_PORT}/<%=baseName%>"
  echo "SPRING_DATASOURCE_URL autoconfigured by docker link: ${SPRING_DATASOURCE_URL}"
else
  echo "SPRING_DATASOURCE_URL init by configuration: ${SPRING_DATASOURCE_URL}"
fi
echo ${SPRING_DATASOURCE_URL}
<%_ } if (prodDatabaseType == 'mongodb') { _%>
################################################################################
# MongoDB
################################################################################
if [ -d ${SPRING_DATA_MONGODB_HOST} ]; then
  SPRING_DATA_MONGODB_HOST=${MONGODB_PORT_27017_TCP_ADDR}
  echo "SPRING_DATA_MONGODB_HOST autoconfigured by docker link: ${SPRING_DATA_MONGODB_HOST}"
else
  echo "SPRING_DATA_MONGODB_HOST init by configuration"
fi
if [ -d ${SPRING_DATA_MONGODB_PORT} ]; then
  SPRING_DATA_MONGODB_PORT=${MONGODB_PORT_27017_TCP_PORT}
  echo "SPRING_DATA_MONGODB_PORT autoconfigured by docker link: ${SPRING_DATA_MONGODB_PORT}"
else
  echo "SPRING_DATA_MONGODB_PORT init by configuration: ${SPRING_DATA_MONGODB_PORT}"
fi
<%_ } if (prodDatabaseType == 'cassandra') { _%>
################################################################################
# Cassandra
################################################################################
if [ -d ${SPRING_DATA_CASSANDRA_CONTACTPOINTS} ]; then
  echo "SPRING_DATA_CASSANDRA_CONTACTPOINTS autoconfigured by docker link"
  SPRING_DATA_CASSANDRA_CONTACTPOINTS=${CASSANDRA_PORT_9042_TCP_ADDR}
else
  echo "SPRING_DATA_CASSANDRA_CONTACTPOINTS init by configuration"
fi
<%_ } if (searchEngine == 'elasticsearch') { _%>
################################################################################
# ElasticSearch
################################################################################
if [ -d ${SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES} ]; then
  SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES="${ELASTIC_PORT_9300_TCP_ADDR}:${ELASTIC_PORT_9300_TCP_PORT}"
  echo "SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES autoconfigured by docker link: ${SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES}"
else
  echo "SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES init by configuration: ${SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES}"
fi
<%_ } _%>
################################################################################
# Start application
################################################################################
if [ -d ${JHIPSTER_SLEEP} ]; then
    JHIPSTER_SLEEP=20
fi
echo "The application will start in ${JHIPSTER_SLEEP}sec..." && sleep ${JHIPSTER_SLEEP}
if [ -d ${JHIPSTER_SPRING} ]; then
  java -jar /app.war \
    --spring.profiles.active=prod ${JHIPSTER_SPRING_ADD} \
  <%_ if (searchEngine == 'elasticsearch') { _%>
    --spring.data.elasticsearch.cluster-nodes=${SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES} \
  <%_ } if (prodDatabaseType == 'mysql' || prodDatabaseType == 'postgresql') { _%>
    --spring.datasource.url=${SPRING_DATASOURCE_URL}
  <%_ } if (prodDatabaseType == 'mongodb') { _%>
    --spring.data.mongodb.host=${SPRING_DATA_MONGODB_HOST} \
    --spring.data.mongodb.port=${SPRING_DATA_MONGODB_PORT}
  <%_ } if (prodDatabaseType == 'cassandra') { _%>
    --spring.data.cassandra.contactpoints=${SPRING_DATA_CASSANDRA_CONTACTPOINTS}
  <%_ } _%>
else
  echo "java -jar /app.war ${JHIPSTER_SPRING}"
  java -jar /app.war ${JHIPSTER_SPRING}
fi
