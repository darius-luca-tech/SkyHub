### What does this project do? 

The project's main target is to be able to get data from the DJI drones, like GPS position, velocity, acceleration on all three axis, etc and plot it accordingly on a map using MapBox API with React JS.

### Technologies 

The technologies I used for this project are:

* springdoc-openapi-ui
* spring-boot-starter-app
* spring-boot-starter-websocket
* ReactJS
* MapBox
* MQTT Broker
* Redis
* MySQL

For caching, I implemented Redis to retain the drones' session handlers for 24 hours. Additionally, I utilized a MySQL 8.0 database running in a Docker container to store various details about the drones, including key IDs, serial numbers (a critical element since the binding between the drone and the Cloud API is based on the drone's serial number), battery serial numbers, payload information, statuses of internal modules, and more.

# Testing

I am proud to share that this code was successfully tested on four different drone models (M300, M350, Matrice 4E, and Matrice 4T) and is fully compatible with them.
