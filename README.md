### What does this project do? 

The project's main target is to be able to get data from the DJI drones, like GPS position, velocity, acceleration on all three axis, etc and plot it accordingly on a map using MapBox API with React JS.

The technologies I used for this project are:

* springdoc-openapi-ui
* spring-boot-starter-app
* spring-boot-starter-websocket
* ReactJS
* MapBox
* MQTT Broker
* Redis
  
I am proud to tell that this code was actually tested on 4 different drones(M300, M350, Matrice 4E, and Matrice 4T) and the software is compatible with those. 

As caching system, I used Redis for the session handlers of the drones to be retained for 24 hours. Additionally, I used MySQL-8.0 in order to store informations about the drones, such as key IDs, serial numbers(which was a crucial piece of information, because the binding between the drone the Cloud API was based on the serial number of the drone), serial number of the batteries, payload information, different statuses of internal modules, etc.
