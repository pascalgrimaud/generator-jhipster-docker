FROM tomcat:8.0.30-jre8
VOLUME /tmp

ADD *.war /usr/local/tomcat/webapps/<%= dockerBaseUrl %>.war

RUN bash -c 'touch /usr/local/tomcat/webapps/<%= dockerBaseUrl %>.war'
ADD run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 8080
VOLUME /tmp
CMD ["/run.sh"]
