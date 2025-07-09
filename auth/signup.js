import {app, auth, createUserWithEmailAndPassword, db, doc, setDoc} from "./config.js";

const emailInp = document.getElementById("emailInp");
const nameInp = document.getElementById("nameInp");
const passInp = document.getElementById("passInp");
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const validatedInps = validateInputs(emailInp.value.trim(), nameInp.value.trim(), passInp.value.trim());
    if(!validatedInps) return alert("Invalid Inputs");
    const {email, name, password} = validatedInps;
    const type = sessionStorage.getItem("userType") || "student";
    const isSignedUp = await signupUser(auth, email, name, password, type);
    
    if(isSignedUp){
        alert("Sign Up Successfull! Login to Continue.");
        window.location.href = './login.html';
    }
    signupForm.reset();
})

function validateInputs(email, name, password) {
    if (!email.length || !name.length || !password.length) return false;
    return {email, name, password};
}

async function signupUser(auth, email, name, password, type) {
    try {
        const userCreds = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCreds.user.uid;
        const userDetails = {userId, name, email, type};
        await registerToDb(userDetails);
        sessionStorage.removeItem('userType');
        return userId;
    } catch (error) {
        const msg = error.code.split("/")[1]
                              .split("").map((el, i) => i === 0 ? el.toUpperCase() : el).join("")
                              .split("-").join(" ");
        alert(msg);
        return false;
    }
}

async function registerToDb(user) {
    try {
        await setDoc(doc(db, "users", user.userId), {
            email: user.email,
            name: user.name,
            type: user.type
          });
    } catch (error) {
        console.log(error);
    }
}