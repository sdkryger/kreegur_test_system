#!/usr/bin/env bash

echo "Starting Vagrant provisioning process..."

apt update && apt upgrade -y

# Install components
apt install -y apache2 php-cli unzip php-curl php-mbstring php-xml libapache2-mod-php php-sybase php-zip composer php-gd

# Setup Apache
cp /vagrant/setup/dev-iws-site.conf /etc/apache2/sites-available/IWS-site.conf
a2ensite IWS-site.conf
a2enmod rewrite

# install MQTT broker and support libraries

# For Installing pecl
apt install -y php-pear php-dev

# Mosquitto setup
apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
apt update
apt install -y libmosquitto-dev mosquitto mosquitto-clients

pecl install Mosquitto-alpha

# Add PHP extension
printf "extension=mosquitto.so" > /etc/php/7.2/mods-available/mosquitto.ini
sudo phpenmod mosquitto

systemctl reload apache2

# Symbolically link website code to www folder
ln -sfn /vagrant /var/www/html
chown www-data:www-data /var/www/html -h

echo "--------------------------------------------------"
echo "Your vagrant instance is ready"