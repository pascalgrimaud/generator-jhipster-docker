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
if [ -d ${JHIPSTER_SLEEP} ]; then
  JHIPSTER_SLEEP=20
fi
<%_ if (dockerTypeImage == 'tomcat' || dockerTypeImage == 'wildfly') { _%>
################################################################################
# Start Application Server
################################################################################
echo "The Application Server will start in ${JHIPSTER_SLEEP}sec..." && sleep ${JHIPSTER_SLEEP}
if [ -d ${JHIPSTER_SPRING} ]; then
  export JAVA_OPTS="-Dspring.profiles.active=prod ${JHIPSTER_SPRING_ADD}"
  <%_ if (searchEngine == 'elasticsearch') { _%>
  export JAVA_OPTS="${JAVA_OPTS} -Dspring.data.elasticsearch.cluster-nodes=\"${SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES}\""
  <%_ } if (prodDatabaseType == 'mysql' || prodDatabaseType == 'postgresql') { _%>
  export JAVA_OPTS="${JAVA_OPTS} -Dspring.datasource.url=\"${SPRING_DATASOURCE_URL}\""
  <%_ } if (prodDatabaseType == 'mongodb') { _%>
  export JAVA_OPTS="${JAVA_OPTS} -Dspring.data.mongodb.host=\"${SPRING_DATA_MONGODB_HOST}\""
  export JAVA_OPTS="${JAVA_OPTS} -Dspring.data.mongodb.port=\"${SPRING_DATA_MONGODB_PORT}\""
  <%_ } if (prodDatabaseType == 'cassandra') { _%>
  export JAVA_OPTS="${JAVA_OPTS} -Dspring.data.cassandra.contactpoints=\"${SPRING_DATA_CASSANDRA_CONTACTPOINTS}\""
  <%_ } _%>
else
  export JAVA_OPTS="${JHIPSTER_SPRING}"
fi

echo "Starting container : <%= dockerTypeImage %>"
<%_ if (dockerTypeImage == 'tomcat') { _%>
# change the password
if [ ! -f /.password ]; then
  echo "Initializing the admin user password..."
  # generate password
  PASS=${TOMCAT_PASS:-JH!pst3r}
  sed -i -e 's/<\/tomcat-users>//' ${CATALINA_HOME}/conf/tomcat-users.xml
  echo '<role rolename="admin-gui"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml
  echo '<role rolename="admin-script"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml
  echo '<role rolename="manager-gui"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml
  echo '<role rolename="manager-script"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml
  echo '<role rolename="manager-jmx"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml
  echo '<role rolename="manager-status"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml
  echo '<user username="tomcat" password="'${PASS}'" roles="manager-gui,manager-script,manager-jmx,manager-status,admin-script,admin-gui"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml
  echo '</tomcat-users>' >> ${CATALINA_HOME}/conf/tomcat-users.xml

  touch /.password
  echo "Initializing the admin user password : ok"
fi
# display info
echo ""
echo "######################################################################"
echo "Base image: <%= dockerBaseImage %>"
echo "You can now configure this server by using:"
echo ""
echo "    URL :      http://localhost:8080 (by default)"
echo "    Username : tomcat"
if [ ! -d ${PASS} ]; then
  echo "    Password : ${PASS}"
else
  echo "    Password : ****************"
fi
echo "    JAVA_OPTS=${JAVA_OPTS}"
echo ""
echo "######################################################################"
echo ""
# start Apache Tomcat
exec /usr/local/tomcat/bin/catalina.sh run
<%_ } _%>

<%_ if (dockerTypeImage == 'wildfly') { _%>
# change the password
if [ ! -f /.password ]; then
  echo "Initializing the admin user password..."
  # change password
  PASS=${JBOSS_PASS:-JH!pst3r}
  /opt/jboss/wildfly/bin/add-user.sh admin ${PASS}
  touch /.password
  echo "Initializing the admin user password : ok"
fi
# display info
echo ""
echo "######################################################################"
echo "Base image: <%= dockerBaseImage %>"
echo "You can now configure this server by using:"
echo ""
echo "    URL :      http://localhost:9990 (by default)"
echo "    Username : admin"
if [ ! -d ${PASS} ]; then
  echo "    Password : ${PASS}"
else
  echo "    Password : ****************"
fi
echo "    JAVA_OPTS=${JAVA_OPTS}"
echo ""
echo "######################################################################"
echo ""
# start JBoss Wilfdly
exec /opt/jboss/wildfly/bin/standalone.sh -b 0.0.0.0 -bmanagement 0.0.0.0
<%_ } _%>
<%_ } else { _%>
################################################################################
# Start application
################################################################################
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
<%_ } _%>
