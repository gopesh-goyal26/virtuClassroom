import { auth, onAuthStateChanged, db, doc, getDoc, getDocs, setDoc, collection, query } from "../auth/config.js";
const classBtn = document.getElementById('createClass');
const classList = document.getElementById('classList');
let teacherId = null;

classBtn.addEventListener('click', async e => {
    if(teacherId) await createRoom(teacherId);
    window.location.href = `../classroom/newClass.html?roomId=${teacherId}`;
})

onAuthStateChanged(auth, async user => {
    if (user) {
        const type = await getUserType(user.uid); 
        if (type === "teacher"){
            teacherId = user.uid;
            classBtn.style.display = "block";
        }
        populateClasses();
    } else{
        window.location.href = '../auth/login.html';
    }
})

async function getUserType(id) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().type;
    } else {
        console.log("No such document!");
    } 
}

async function populateClasses(){
    const roomsList = await getDocs(query(collection(db, 'rooms')));
    roomsList.docs.forEach(async room => {
        const teacherId = room.id;
        const teacherRef = await getDoc(doc(db, 'users', teacherId));
        const teacherName = teacherRef.data().name;
        const li = document.createElement('li');
        const p = document.createElement('p');
        const btn = document.createElement('button');
        p.textContent = teacherName;
        btn.textContent = "Join Class";
        btn.classList.add('joinBtn');
        btn.addEventListener('click', () => {
            window.location.href = `../classroom/newClass.html?roomId=${teacherId}`;
        })
        li.append(p, btn);
        classList.appendChild(li);
    });
}

async function createRoom(id) {
    try {
        const roomRef = doc(db, "rooms", id);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            await setDoc(roomRef, {
                createdBy: id,
                createdAt: Date.now(),
                active: true
            });
        }
    } catch (error) {
        console.log("Error creating room:", error);
    }
}