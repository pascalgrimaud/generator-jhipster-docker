FROM jboss/wildfly:10.1.0.Final

ENV JHIPSTER_SLEEP 0
ENV WILDFLY_PASSWORD JH!pst3r

# add source
USER root
ADD *.war.original /opt/jboss/wildfly/standalone/deployments/<%= dockerBaseUrl %>.war
RUN chown jboss:jboss /opt/jboss/wildfly/standalone/deployments/<%= dockerBaseUrl %>.war && \
    bash -c 'touch /opt/jboss/wildfly/standalone/deployments/<%= dockerBaseUrl %>.war' && \
    # configure admin password
    /opt/jboss/wildfly/bin/add-user.sh admin ${WILDFLY_PASSWORD}

USER jboss
VOLUME /tmp
EXPOSE 8080 9990<% if (cacheProvider === 'hazelcast') { %> 5701/udp<% } %>
CMD echo "The application will start in ${JHIPSTER_SLEEP}s..." && \
    sleep ${JHIPSTER_SLEEP} && \
    /opt/jboss/wildfly/bin/standalone.sh -b 0.0.0.0 -bmanagement 0.0.0.0
