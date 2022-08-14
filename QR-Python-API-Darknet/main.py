#0xCleon

import json
from operator import truediv
import numpy as np
import time
from tempfile import NamedTemporaryFile
from pandas import array
from pyzbar import pyzbar
import argparse
import cv2

class qr_detector:

    def __init__(self, path) :
        self.path = path 
    def show(self, frame):
        return cv2.imshow(self, frame)
    def read(self):
        return cv2.imread(self)

    def decoder(image, dictionary, array):
        
        barcodes = pyzbar.decode(image)
        for barcode in barcodes:
        # The location of the bounding box from which the barcode is extracted
        # Draw the bounding box of the barcode in the image
            (x, y, w, h) = barcode.rect
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)

            # The barcode data is a byte object, so if we want to print it on the output image
            # To draw it, you need to convert it into a string first
            barcodeData = barcode.data.decode("utf-8")
            barcodeType = barcode.type

            # Draw the barcode data and barcode type on the image
            text = "{} ({})".format(barcodeData, barcodeType)
            cv2.putText(image, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX,
            0.5, (0, 0, 255), 2)

            array.append(barcodeData)
            

        return 
            
    def detect(self, frame):
       
        width = 640
        height = 640
        if frame.shape[1] > 1024 or frame.shape[0] > 1024:
            width = 1024
            height = 1024
            qr_detector.model.setInputParams(size=(width, height), scale=1/255, swapRB=True)

        # Inferencing
        CONFIDENCE_THRESHOLD = 0.2
        NMS_THRESHOLD = 0.4
        COLOR_RED = (0,0,255)
        COLOR_BLUE = (255,0,0)
        start_time = time.time()
        classes, scores, boxes = qr_detector.model.detect(frame, CONFIDENCE_THRESHOLD, NMS_THRESHOLD)
        elapsed_ms = time.time() - start_time
        dictionary = {}
        array = []
        cv2.putText(frame, '%.2f s, Qr found: %d' % (elapsed_ms, len(classes)), (40, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, COLOR_RED, 2)
        class_names = open('data/obj.names').read().strip().split('\n')
        for (classid, score, box) in zip(classes, scores, boxes):
            label = "%s : %f" % (class_names[classid], score) 
            cv2.rectangle(frame, box, COLOR_BLUE, 2)
            #cv.putText(frame, label, (box[0], box[1] - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, COLOR_BLUE, 2)
            x,y,w,h = box
            ROI = frame[y:y+h, x:x+w]
            file = NamedTemporaryFile(suffix=".jpg",prefix="./frame_",delete=True)
            cv2.imwrite(file.name, ROI)
            qr_detector.decoder(ROI, dictionary, array)
            file.close()

        return array

    net = cv2.dnn.readNetFromDarknet('backup/yolov4-tiny-custom-640.cfg', 'backup/yolov4-tiny-custom-640_last.weights')
    net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
    model = cv2.dnn_DetectionModel(net)

class Mode:

    def __init__(self, path):
        self.path = path

    def Video(path):
        while(True):
            try:
                ret, frame = path.read()
                file = NamedTemporaryFile(suffix=".jpg",prefix="./frame_",delete=True)
                cv2.imwrite(file.name, frame)
                ret = qr_detector.detect(file.name, frame)
                qr_detector.show('frame',frame)
                if len(ret)>=1:
                    for i in ret:
                        if i not in c:
                            c.append(i)
                            print(c)
                            json_file = json.dumps(c)
                            json_last = json.dumps(i)
                            with open("data.json", "w") as outfile:
                                outfile.write(json_file)
                            with open("data_last.json", "w") as outfile2:
                                outfile2.write(json_last)
                        else:
                            pass
                
                #print(ret)
                file.close()
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            except Exception as e:  # Si hay una excepcion, muestra cual es 🤔
                print(e)
c = []
input_video = cv2.VideoCapture(0)
new_array= []
Mode.Video(input_video)
    
