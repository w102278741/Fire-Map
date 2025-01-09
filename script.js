// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpG5verrbzKiIxFfcbiYG4GaLmRRLXIZ8",
  authDomain: "firemap-538a6.firebaseapp.com",
  databaseURL: "https://firemap-538a6.firebaseio.com",
  projectId: "firemap-538a6",
  storageBucket: "firemap-538a6.appspot.com",
  messagingSenderId: "303164276549",
  appId: "1:303164276549:web:5908b3db14be6bcbae882c",
  measurementId: "G-W2LGWW79MC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let map;

// Initialize Google Map
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.0522, lng: -118.2437 },
    zoom: 8,
  });

  loadUserMarkers();
};

// Load markers from Firebase
function loadUserMarkers() {
  const dbRef = database.ref("markers");
  dbRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      for (const key in data) {
        const markerInfo = data[key];
        const marker = new google.maps.Marker({
          position: { lat: markerInfo.lat, lng: markerInfo.lng },
          map: map,
          title: markerInfo.notes,
        });
      }
    }
  });
}

    }
  });
}
