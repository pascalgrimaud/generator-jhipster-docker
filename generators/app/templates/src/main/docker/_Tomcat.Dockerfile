FROM tomcat:8-jre8-alpine

ENV JHIPSTER_SLEEP 0
ENV TOMCAT_PASSWORD JH!pst3r
ENV CATALINA_HOME /usr/local/tomcat/

# add directly the war
ADD *.war.original /usr/local/tomcat/webapps/<%= dockerBaseUrl %>.war
RUN sh -c 'touch /usr/local/tomcat/webapps/<%= dockerBaseUrl %>.war' && \
    # configure admin password
    sed -i -e 's/<\/tomcat-users>//' ${CATALINA_HOME}/conf/tomcat-users.xml && \
    echo '<role rolename="admin-gui"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml && \
    echo '<role rolename="admin-script"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml && \
    echo '<role rolename="manager-gui"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml && \
    echo '<role rolename="manager-script"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml && \
    echo '<role rolename="manager-jmx"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml && \
    echo '<role rolename="manager-status"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml && \
    echo '<user username="tomcat" password="'${TOMCAT_PASSWORD}'" roles="manager-gui,manager-script,manager-jmx,manager-status,admin-script,admin-gui"/>' >> ${CATALINA_HOME}/conf/tomcat-users.xml && \
    echo '</tomcat-users>' >> ${CATALINA_HOME}/conf/tomcat-users.xml

VOLUME /tmp
EXPOSE 8080<% if (cacheProvider === 'hazelcast') { %> 5701/udp<% } %>
CMD echo "The application will start in ${JHIPSTER_SLEEP}s..." && \
    sleep ${JHIPSTER_SLEEP} && \
    /usr/local/tomcat/bin/catalina.sh run
