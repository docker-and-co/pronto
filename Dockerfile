
FROM ruby:2.2
RUN apt-get install curl
RUN ls -sv /bin/bash /bin/sh
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y cmake
RUN gem install pronto
RUN gem install pronto-eslint
RUN gem install execjs
RUN gem install json

ADD pronto-gitlab /bin/pronto-gitlab
ADD eslint.rb /usr/local/bundle/gems/pronto-eslint-0.6.1/lib/pronto/eslint.rb

RUN cd /tmp && git clone https://github.com/tomfun/pronto-phpcs.git && cd pronto-phpcs/ && gem build pronto-phpcs.gemspec && gem install --user-install pronto-phpcs-0.0.1.gem
RUN apt-get update && apt-get install php5 -y

ADD composer.sh /tmp/install_composer.sh
RUN /tmp/install_composer.sh

RUN composer global require squizlabs/php_codesniffer=2.* && composer global require escapestudios/symfony2-coding-standard=* && /root/.composer/vendor/bin/phpcs --config-set installed_paths /root/.composer/vendor/escapestudios/symfony2-coding-standard

ENTRYPOINT /bin/pronto-gitlab