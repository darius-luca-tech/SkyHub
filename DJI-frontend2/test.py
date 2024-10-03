import cv2

# Replace with your RTMP stream URL
rtmp_url = 'rtmp://192.168.215.171/live'

# Open the RTMP stream using OpenCV
cap = cv2.VideoCapture(rtmp_url)

if not cap.isOpened():
    print("Error: Could not open RTMP stream.")
    exit()

# Read frames from the stream
while True:
    ret, frame = cap.read()

    if not ret:
        print("Error: Could not read frame from RTMP stream.")
        break

    # Display the frame
    cv2.imshow('RTMP Stream', frame)

    # Exit on pressing the 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and close the window
cap.release()
cv2.destroyAllWindows()
