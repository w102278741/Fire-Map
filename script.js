// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpG5verrbzKiIxFfcbiYG4GaLmRRLXIZ8",
  authDomain: "firemap-538a6.firebaseapp.com",
  databaseURL: "https://firemap-538a6-default-rtdb.firebaseio.com/",
  projectId: "firemap-538a6",
  storageBucket: "firemap-538a6.firebasestorage.app",
  messagingSenderId: "303164276549",
  appId: "1:303164276549:web:5908b3db14be6bcbae882c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let map;
let userMarkers = []; // To store markers added by users

// Initialize Google Map
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles coordinates
    zoom: 8,
  });

  loadUserMarkers(); // Load existing markers from Firebase
};

// Add marker functionality
document.getElementById("addMarkerBtn").addEventListener("click", () => {
  map.addListener("click", (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const formPopup = `
      <div>
        <h3>Add Missing Info</h3>
        <label>Status:</label><br>
        <select id="status">
          <option value="Missing Pets">Missing Pets</option>
          <option value="Missing People">Missing People</option>
          <option value="Property Status Unknown">Property Status Unknown</option>
        </select><br><br>
        <label>Notes:</label><br>
        <textarea id="notes" rows="3"></textarea><br><br>
        <button id="saveMarker">Save</button>
      </div>
    `;

    const infowindow = new google.maps.InfoWindow({
      content: formPopup,
      position: event.latLng,
    });

    infowindow.open(map);

    // Save marker on clicking 'Save'
    document.getElementById("saveMarker").addEventListener("click", () => {
      const status = document.getElementById("status").value;
      const notes = document.getElementById("notes").value;

      const markerData = { lat, lng, status, notes };
      saveData(markerData);

      infowindow.close();
    });
  });
});

// Save data to Firebase
function saveData(data) {
  const dbRef = ref(database, "markers");
  push(dbRef, data)
    .then(() => alert("Information submitted successfully!"))
    .catch((error) => console.error("Error saving data:", error));
}

// Load markers from Firebase
function loadUserMarkers() {
  const dbRef = ref(database, "markers");
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      for (const key in data) {
        const markerInfo = data[key];
        const marker = new google.maps.Marker({
          position: { lat: parseFloat(markerInfo.lat), lng: parseFloat(markerInfo.lng) },
          map: map,
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // User markers styled as blue
          title: markerInfo.notes,
        });

        const infowindow = new google.maps.InfoWindow({
          content: `<strong>Status:</strong> ${markerInfo.status}<br><strong>Notes:</strong> ${markerInfo.notes}`,
        });

        marker.addListener("click", () => {
          infowindow.open(map, marker);
        });

        userMarkers.push(marker);
      }
    }
  });
}
