// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database"; // Importações corretas do Firebase

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqtrjo-ZHZj7K3WHhyqTLRG3c1fipsFeA",
  authDomain: "sistema-encomendas-56e8f.firebaseapp.com",
  databaseURL: "https://sistema-encomendas-56e8f-default-rtdb.firebaseio.com",
  projectId: "sistema-encomendas-56e8f",
  storageBucket: "sistema-encomendas-56e8f.appspot.com",
  messagingSenderId: "1007480610856",
  appId: "1:1007480610856:web:8d4c059f447f7f03a2d51d",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exporta as funções e a instância do banco de dados
export { database, ref, set, get };
