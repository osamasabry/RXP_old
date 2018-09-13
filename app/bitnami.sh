#!/bin/sh

PATH="/opt/bitnami/nodejs/bin:/opt/bitnami/git/bin:/opt/bitnami/mongodb/bin:/opt/bitnami/sqlite/bin:/opt/bitnami/php/bin:/opt/bitnami/python/bin:/opt/bitnami/apache2/bin:/opt/bitnami/common/bin:$PATH"
export PATH

if [ -s /opt/bitnami/.bitnamirc ]; then
  . /opt/bitnami/.bitnamirc
fi

if [ "x$USER" != "x" ] && [ -d /home/$USER ] && [ ! -f /home/$USER/.first_login_bitnami ]; then
  if [ -d /opt/bitnami/apps ]; then
    ln -fTs /opt/bitnami/apps /home/$USER/apps
  fi
  if [ -d /opt/bitnami/apache2/htdocs ]; then
    ln -fTs /opt/bitnami/apache2/htdocs /home/$USER/htdocs
  fi
  ln -fTs /opt/bitnami /home/$USER/stack
  touch /home/$USER/.first_login_bitnami
fi
CLOUDSDK_PYTHON=/usr/bin/python
export CLOUDSDK_PYTHON
SENDGRID_API_KEY="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"
export SENDGRID_API_KEY
