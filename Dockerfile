FROM linkeddata/gold

MAINTAINER Justas Azna <justas@reederz.com>
# ENV REFRESHED_AT 2016-01-17


RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash - \
    && apt-get install -y nodejs \
    && npm install -g gulp bower

ADD . /app

WORKDIR /app

RUN npm install
RUN bower install --allow-root --config.interactive=false
RUN gulp build
