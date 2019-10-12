# kreegur_test_system
Test rig software - browser based data logging and control

## Overview
### Purpose
General data logging and viewing (numeric values) from any source. 

### Architecture
- Data distribution and communication via MQTT broker
- Data viewing via page on web server
- Data logging via Python script (not implemented yet)

### Hardware
- Currently implemented on a Raspberry Pi but other hardware could be used

## Installation
- Must install mqtt broker such as Mosquitto. The system currently expects the mqtt broker to be installed on the same machine (same ip address)
- Tested with Apache server with php
- Place files in Apache public docs folder (/var/www/html)

## Operation
- Start Python script `python/processor.py` to send processor heartbeat
- OPTIONAL - Start Python script `python/simulatedData.py` to broadcast simulated data

### Data display and logging
Publish data to the mqtt broker to display it and log it. 
#### Topic
The topic should start with `data/numeric/` followed by the channel description (no spaces in description). For example, for the outside temperature, the topic could be `data/numeric/temperatureOutside_degC`
#### Payload
The payload should be a numeric value such as `-15.5` or `12340`

### Logging (processor) module
The logging module is meant to be implemented as a separate Python script. This script (not completed) performs the logging operations and broadcasts its status for display in the user interface

Log file location is currently hardcoded to directory `/var/www/html/logging`
#### Messages
##### Module heartbeat
The module should broadcast a heartbeat so that the user knows that the module is operational.
###### Topic
The topic broadcast is `processor/heartbeat`
###### Payload
The payload is a JSON string that indicates whether the processor is currently logging. For example: 
`{"logging":true}`
##### Logging start command
###### Topic
`processor/logging`
###### Payload
`start`
##### Logging stop command
###### Topic
`processor/logging`
###### Payload
`stop`
