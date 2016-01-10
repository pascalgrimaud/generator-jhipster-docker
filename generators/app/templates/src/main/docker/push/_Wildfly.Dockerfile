FROM jboss/wildfly:9.0.1.Final
VOLUME /tmp

ADD *.war.original /opt/jboss/wildfly/standalone/deployments/<%= dockerBaseUrl %>.war
ADD run.sh /run.sh

USER root
RUN chown jboss:jboss /run.sh
RUN chmod +x /run.sh
RUN chown jboss:jboss /opt/jboss/wildfly/standalone/deployments/<%= dockerBaseUrl %>.war
RUN bash -c 'touch /opt/jboss/wildfly/standalone/deployments/<%= dockerBaseUrl %>.war'

USER jboss
EXPOSE 8080 9990
VOLUME /tmp
CMD ["/run.sh"]
