 import { getAuth, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot } 
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileEnergy = document.getElementById("profileEnergy");
const logoutBtn = document.getElementById("logoutBtn");

// İstifadəçi vəziyyəti
onAuthStateChanged(auth, (user) => {
  if (user) {
    profileEmail.textContent = user.email;
    profileName.textContent = user.displayName || "EnerjiX istifadəçisi";

    // Enerji məlumatlarını yığ
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
    window.location.href = "index.html"; // daxil olmayıbsa əsas səhifəyə yönləndir
  }
});

// Çıxış
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
