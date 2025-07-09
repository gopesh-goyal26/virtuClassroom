import {auth, signInWithEmailAndPassword} from "./config.js";

const emailInp = document.getElementById("emailInp");
const passInp = document.getElementById("passInp");
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
        const validatedInps = validateInputs(emailInp.value.trim(), passInp.value.trim());
    if(!validatedInps) return alert("Invalid Inputs");
    const {email, password} = validatedInps;
    const isLoggedUp = await loginUser(auth, email, password);
    if(isLoggedUp){
        window.location.href = '../dashboard/dashboard.html';
    }
    loginForm.reset();
})

function validateInputs(email, password) {
    if (!email.length || !password.length) return false;
    return {email, password};
}

async function loginUser(auth, email, password) {
    try {
        const userCreds = await signInWithEmailAndPassword(auth, email, password);
        const userId = userCreds.user.uid;        
        return userId;
    } catch (error) {        
        const msg = error.code.split("/")[1]
                              .split("").map((el, i) => i === 0 ? el.toUpperCase() : el).join("")
                              .split("-").join(" ");
        alert(msg);
        return false;
    }
}