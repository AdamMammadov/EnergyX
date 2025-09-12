 import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } 
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { app } from "./firebase.js";

// Firebase servisleri
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 DOM elementləri
const profileLink = document.getElementById("profileLink");
const logoutBtn = document.getElementById("logoutBtn");
const profilePage = document.getElementById("profilePage");
const profileEmail = document.getElementById("profileEmail");
const profileEnergy = document.getElementById("profileEnergy");

// ✅ Qeydiyyat
document.getElementById("registerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Qeydiyyat uğurlu!"))
    .catch(error => alert(error.message));
});

// ✅ Daxil olma
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Daxil oldun!"))
    .catch(error => alert(error.message));
});

// ✅ Enerji əlavə etmə
document.getElementById("energyForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const produced = Number(document.getElementById("produced").value);
  const consumed = Number(document.getElementById("consumed").value);
  const user = auth.currentUser;

  if (!user) {
    alert("Əvvəlcə daxil ol!");
    return;
  }

  const share = produced - consumed;

  await addDoc(collection(db, "energyData"), {
    userId: user.uid,
    produced,
    consumed,
    share,
    createdAt: serverTimestamp()
  });

  alert("Məlumat əlavə olundu!");
});

// ✅ Auth vəziyyəti izləmə
onAuthStateChanged(auth, (user) => {
  if (user) {
    profileLink.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";
    profileEmail.textContent = user.email;

    // 🔹 istifadəçinin enerjisini dinamik götür
    const q = query(
      collection(db, "energyData"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      let totalShare = 0;
      snapshot.forEach(doc => totalShare += doc.data().share || 0);
      profileEnergy.textContent = totalShare;
    });

  } else {
    profileLink.style.display = "none";
    logoutBtn.style.display = "none";
    profilePage.style.display = "none";
  }
});

// ✅ Profil linkinə klik
profileLink?.addEventListener("click", (e) => {
  profilePage.style.display = "block";
});

// ✅ Çıxış
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  alert("Çıxdın!");
});

// ✅ Profil bağlama funksiyası (HTML-də çağırılır)
window.closeProfile = function () {
  profilePage.style.display = "none";
};

