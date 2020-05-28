import paho.mqtt.client as mqtt
import time
import json
import datetime
import csv
import sys
import math

state = {
    "logging":False
}
numericNames = ['Elapsed time (s)'] #names of all the numeric data 
numericValues = [0.00] #values of all the numeric data
logFile = '' #file reference
filename = '' #filename'
wr = '' #csv file writer
startTime = '' #datetime.datetime.now()'' #file start time

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
        message = json.loads(msg.payload)
        if(message["command"]=='start'):
            print ("should start logging")
            startTime = ''
            state.update({"logging":True})
            filename = datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S") + '.csv'
            #filepath = '/var/www/html/logging/'+filename #linux
            filepath = "C:\\Apache24\\htdocs\\kreegur_test_system\\logging\\"+filename #windows
            
            try:
                #logFile = open(filepath, "w") #linux
                logFile = open(filepath, "w", newline='') #windows
            except:
                print ("file open error: " + sys.exc_info()[0])
            wr = csv.writer(logFile, dialect='excel')
            wr.writerow(numericNames)
            client.publish('processor/loggingStart',json.dumps({"filename":filename,"path":'logging/'+filename}))
            
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
            if(name in numericNames):
                i = numericNames.index(name)
                numericValues[i] = val
            else:
                numericNames.append(name)
                numericValues.append(val)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("127.0.0.1", 1883, 60)
client.subscribe('#')

client.loop_start()

loopCount = 0
loopStart = time.time()
x = 0
while True:
    if(state["logging"]):
        if(startTime==''):
            startTime = time.time()
        #should log to file
        currTime = datetime.datetime.now()
        delta = time.time() - startTime
        numericValues[0] = round(delta,1)
        print (numericValues)
        wr.writerow(numericValues)
        fileSize = logFile.tell()
        fileSize = round(fileSize / 1024.0,3)
        if fileSize > 1024:
            fileSize = round(fileSize / 1024.0,3)
            fileSize = str(fileSize) + ' MB'
        else:
            fileSize = str(fileSize) + ' kB'
            client.publish("processor/fileSize",fileSize)
    client.publish("processor/heartbeat",json.dumps(state))

    #simulate data
    temp = round((math.cos(x) * 8 + 12),1)
    client.publish("data/numeric/temperatureOuter2_degC",temp)

    remainder = time.time()%1
    toNextSecond = 1 - remainder
    time.sleep(toNextSecond)
    x += 0.1
    print("temp:"+str(temp)+", x:"+str(x))