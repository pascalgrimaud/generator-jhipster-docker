FROM java:openjdk-8u66-jre
VOLUME /tmp

ADD *.war /app.war

RUN bash -c 'touch /app.war'
ADD run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 8080
VOLUME /tmp
CMD ["/run.sh"]
