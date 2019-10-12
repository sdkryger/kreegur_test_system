import paho.mqtt.client as mqtt
import time
import json
import datetime
import csv
import sys

state = {
    "logging":False,
    "trigger":''
}
numericNames = [] #names of all the numeric data 
numericValues = [] #values of all the numeric data
logFile = '' #file reference
wr = '' #csv file writer


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    global state
    global numericData
    global logFile
    global wr
    #print(msg.topic+" "+str(msg.payload))
    if(msg.topic == 'processor/logging'):
        #print "Logging message received: "+str(msg.payload)
        message = json.loads(str(msg.payload))
        print message
        if(message["command"]=='start'):
            #print "should start logging"
            state.update({"logging":True})
            state.update({"trigger":message["trigger"]})
            print state
            filename = datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S") + '.csv'
            filepath = '/var/www/html/logging/'+filename
            
            try:
                logFile = open(filepath, "w")
                print "success opening file"
            except:
                print "file open error: " + sys.exc_info()[0]
            wr = csv.writer(logFile, dialect='excel')
            wr.writerow(numericNames)
            
        else:
            print "should stop logging"
            state.update({"logging":False})
            logFile.close()
    elif (msg.topic != 'processor/heartbeat'): #ignore processor/heartbeat topic
        topicArray = msg.topic.split('/')
        print topicArray
        if(topicArray[0] == 'data' and topicArray[1] == 'numeric'):
            val = float(msg.payload)
            name = topicArray[2]
            #print "received numeric data with name: " + name + " and value: "+ str(val)
            if(name in numericNames):
                #print name + " is already in the list"
                i = numericNames.index(name)
                numericValues[i] = val
            else:
                #print "did not find " + name + " in the list, will add"
                numericNames.append(name)
                numericValues.append(val)
            print numericNames
            print numericValues
            
            if(state["logging"] and state["trigger"] == name):
                print "value has triggered logging"
                #should log to file
                wr.writerow(numericValues)
                
                
                

client = mqtt.Client()
client.on_message = on_message

print "will try to connect"
client.connect("127.0.0.1", 1883, 60)
client.subscribe('#')

client.loop_start()

while True:
    client.publish("processor/heartbeat",json.dumps(state))
    time.sleep(1)
