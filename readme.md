# Virtual Classroom Web App

## Introduction
A web-based virtual classroom platform that enables real-time video conferencing between teachers and students. It provides teachers the ability to create virtual classes, which students can join to participate in live video lessons. The application uses WebRTC for peer-to-peer video streaming, and Firebase is employed for user authentication and real-time signaling.

## Project Type
Fullstack

## Deployed App
Frontend: [https://your-frontend-url.com](https://your-frontend-url.com)  
Backend: [Handled via Firebase]  
Database: [Firestore - https://console.firebase.google.com]

## Directory Structure
my-app/
    ├─ auth/ 
    | ├─ css/
    | | ├─ login.css
    | | ├─ signup.css
    | ├─ config.js
    | ├─ signupTeacher.html
    | ├─ signupTeacher.js
    | ├─ signup.html
    | ├─ signup.js
    | ├─ login.html
    | ├─ login.js
    ├─ classroom/ 
    │ ├─ class.html 
    │ ├─ class.js
    | ├─ class.css 
    ├─ dashboard/ 
    │ ├─ dashboard.html
    │ ├─ dashboard.js 
    | ├─ dashboard.css
    ├─ assets/ 
    │ ├─ logo.png 
    | ├─ landing-illustrations.png

## Video Walkthrough of the project
Attach a very short video walkthrough of all of the features [1 - 3 minutes]

## Video Walkthrough of the codebase
Attach a very short video walkthrough of the codebase [1 - 5 minutes]

## Features
- Firebase Authentication for login
- Role-based access: Teachers can create and manage classes, students can join classes
- Real-time peer-to-peer WebRTC video connection
- Teachers can manage and track peer presence in rooms
- Active peer presence tracking using `lastSeen`
- ICE candidate exchange for stable video calls
- Dynamic video feed layout with multiple remote participants

## Design Decisions or Assumptions
- Firebase Authentication is used for managing user logins.
- Firestore is used to store data related to rooms, peers, and connections.
- Teachers are responsible for creating rooms (one active room per teacher).
- Room ID is the teacher's UID for unique identification.
- All participants in a room can connect to one another via WebRTC.
- Simple UI structure designed to accommodate the video calls and real-time communication.
- ICE candidates and signaling data are managed in Firestore.

## Installation & Getting Started
Detailed instructions on how to install, configure, and get the project running.

```bash
git clone https://github.com/yourusername/virtual-classroom.git
cd virtual-classroom
```
## Credentials
Either create accounts from signup page, or use mentioned accounts for testing.  
**NOTE-** For creating teacher account, change the url to signupTeacher.html instead of signup.html.  

**Teacher Login:**  
Email: teacher@gmail.com  
Password: teacher  

**Student Login:**  
Email: student@gmail.com  
Password: student  

## Usage
To use the virtual classroom application, follow the steps below:

### 1. Access the Application
- Go to the login page by navigating to the **Login** URL.
- Use the provided credentials to log in as either a **Teacher** or **Student**.

### 2. Teacher
- Upon logging in, if you're a teacher, you will have the option to **Create a Class**.
- Click on the **Create Class** button, which will create a new classroom and redirect you to the classroom page.
- You can then share the classroom link with students.

### 3. Student
- As a student, you will see a list of ongoing classes available to join.
- Click on a class and join the session. You will automatically connect to the teacher and other students.

### 4. Video Calling
- The video call will start once both the teacher and student are connected.
- The teacher can see all the students in the classroom, and the students can see the teacher and other participants.
- Use the **mute/unmute** buttons to control your microphone.

### 5. Real-Time Interaction
- All users can interact via video in real-time.
- The teacher has the ability to manage peers and remove inactive users from the class.

#### Example
1. **Teacher logs in** using their credentials (e.g., teacher@gmail.com / teacher).
2. **Teacher clicks on "Create Class"**, which creates a new room.
3. **Student logs in** using their credentials (e.g., student@gmail.com / student).
4. **Student selects an ongoing class** and joins the room.
5. The **video call starts** automatically, and users can interact in real-time.

Include screenshots as necessary:
- A screenshot showing the teacher's class creation screen.
- A screenshot showing the student joining an ongoing class.
- A screenshot showing the video conferencing layout.

## Technology Stack
The following technologies were used to build the Virtual Classroom application:

- **Firebase Authentication**: Used for secure user authentication. Firebase Auth handles user login and registration for both teachers and students.

- **Firestore (Firebase)**: A NoSQL cloud database used to store real-time data, such as user information, classroom data, and peer connections for the virtual classroom.

- **WebRTC**: Enables real-time video and audio communication between peers (teacher and students). WebRTC is used for peer-to-peer connections during class sessions.

- **HTML5**: Used to structure the pages and create the elements of the user interface, such as video containers, buttons, and input forms.

- **CSS**: Custom styles are applied to make the application visually appealing and responsive for both desktop and mobile devices.

- **JavaScript (Vanilla)**: Used for handling the frontend logic, including user interactions, real-time data handling, and connecting to the backend services.

- **STUN Servers**: WebRTC uses STUN servers to discover the public IP addresses of peers, facilitating peer-to-peer connections for video calls.