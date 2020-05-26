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
numericNames = ['Elapsed time (s)'] #names of all the numeric data 
numericValues = [0.00] #values of all the numeric data
logFile = '' #file reference
filename = '' #filename'
wr = '' #csv file writer
startTime = datetime.datetime.now() #file start time

def on_connect():
  print ("Connected!")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    global state
    global numericNames
    global numericValues
    global logFile
    global wr
    global filename
    global startTime
    #print(msg.topic+" "+str(msg.payload))
    if(msg.topic == 'processor/logging'):
        #print ("Logging message received: "+str(msg.payload))
        message = json.loads(msg.payload)
        #print (message["command"])
        if(message["command"]=='start'):
            print ("should start logging")
            state.update({"logging":True})
            state.update({"trigger":message["trigger"]})
            #print state
            filename = datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S") + '.csv'
            #filepath = '/var/www/html/logging/'+filename #linux
            filepath = "C:\\Apache24\\htdocs\\kreegur_test_system\\logging\\"+filename #windows
            
            try:
                #logFile = open(filepath, "w") #linux
                logFile = open(filepath, "w", newline='') #windows
                #print ("success opening file")
                startTime = datetime.datetime.now()
            except:
                print ("file open error: " + sys.exc_info()[0])
            wr = csv.writer(logFile, dialect='excel')
            #print("Opened log file")
            #print(numericNames)
            #print(wr)
            wr.writerow(numericNames)
            #print("name write success")
            
        else:
            print ("should stop logging")
            state.update({"logging":False})
            logFile.close()
            client.publish('processor/loggingStop',json.dumps({"filename":filename,"path":'logging/'+filename}))
    elif (msg.topic != 'processor/heartbeat'): #ignore processor/heartbeat topic
        topicArray = msg.topic.split('/')
        
        if(topicArray[0] == 'data' and topicArray[1] == 'numeric'):
            val = float(msg.payload)
            name = topicArray[2]
            #print ("received numeric data with name: " + name + " and value: "+ str(val))
            if(name in numericNames):
                #print name + " is already in the list"
                i = numericNames.index(name)
                numericValues[i] = val
            else:
                #print "did not find " + name + " in the list, will add"
                numericNames.append(name)
                numericValues.append(val)
            #print (numericNames)
            #print (numericValues)
            
            if(state["logging"] and state["trigger"] == name):
                #print ("value has triggered logging")
                #should log to file
                currTime = datetime.datetime.now()
                delta = currTime - startTime
                numericValues[0] = round(delta.total_seconds(),3)
                #print (numericValues)
                wr.writerow(numericValues)
                #print ("write success?")
                fileSize = logFile.tell()
                fileSize = round(fileSize / 1024.0,3)
                if fileSize > 1024:
                    fileSize = round(fileSize / 1024.0,3)
                    fileSize = str(fileSize) + ' MB'
                else:
                    fileSize = str(fileSize) + ' kB'
                #print ("filesize: "+fileSize)
                client.publish("processor/fileSize",fileSize)
        #else:
            #print topicArray
            #print str(msg.payload)
                
                
                

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

print ("will try to connect")
client.connect("127.0.0.1", 1883, 60)
print ("Connected?")
client.subscribe('#')

client.loop_start()

loopCount = 0
while True:
    #print ("looping...")
    client.publish("processor/heartbeat",json.dumps(state))
    client.publish("data/numeric/temperatureOuter2_degC",loopCount)
    time.sleep(1)
    loopCount = loopCount + 1