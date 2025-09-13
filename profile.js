 import { 
  getAuth, onAuthStateChanged, signOut, 
  updateProfile, updateEmail, updatePassword 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { 
  getFirestore, doc, setDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

// DOM elementləri
const profilePic = document.getElementById("profilePic");
const uploadImage = document.getElementById("uploadImage");
const displayNameInput = document.getElementById("displayName");
const newEmailInput = document.getElementById("newEmail");
const newPasswordInput = document.getElementById("newPassword");
const energyValue = document.getElementById("energyValue");

const saveProfileBtn = document.getElementById("saveProfile");
const updateEmailBtn = document.getElementById("updateEmail");
const updatePasswordBtn = document.getElementById("updatePassword");
const increaseEnergyBtn = document.getElementById("increaseEnergy");
const decreaseEnergyBtn = document.getElementById("decreaseEnergy");
const logoutBtn = document.getElementById("logoutBtn");

let energyCount = 0;

// 🔹 İstifadəçi vəziyyəti
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html"; 
    return;
  }

  // Firestore məlumatlarını yüklə
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    energyCount = data.energy || 0;
    energyValue.textContent = energyCount;
    if (data.displayName) displayNameInput.value = data.displayName;
    if (data.photoURL) profilePic.src = data.photoURL;
  }

  // Auth məlumatlarını yüklə
  if (user.displayName) displayNameInput.value = user.displayName;
  if (user.email) newEmailInput.value = user.email;
  if (user.photoURL) profilePic.src = user.photoURL;
});

// 🔹 Profil yadda saxla (ad və şəkil)
saveProfileBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  await updateProfile(user, {
    displayName: displayNameInput.value,
    photoURL: profilePic.src
  });

  await setDoc(doc(db, "users", user.uid), {
    displayName: displayNameInput.value,
    photoURL: profilePic.src,
    energy: energyCount
  }, { merge: true });

  alert("Profil uğurla yadda saxlandı ✅");
});

// 🔹 Email dəyiş
updateEmailBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  try {
    await updateEmail(user, newEmailInput.value);
    alert("Email dəyişdirildi!");
  } catch (err) {
    alert("Xəta: " + err.message);
  }
});

// 🔹 Şifrə dəyiş
updatePasswordBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  try {
    await updatePassword(user, newPasswordInput.value);
    alert("Şifrə dəyişdirildi!");
  } catch (err) {
    alert("Xəta: " + err.message);
  }
});

// 🔹 Şəkil seç
uploadImage.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      profilePic.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// 🔹 Enerji artır/azalt
increaseEnergyBtn.addEventListener("click", () => {
  energyCount++;
  energyValue.textContent = energyCount;
});

decreaseEnergyBtn.addEventListener("click", () => {
  if (energyCount > 0) energyCount--;
  energyValue.textContent = energyCount;
});

// 🔹 Çıxış
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

