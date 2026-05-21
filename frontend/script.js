// =========================
// 🌐 CONFIGURAÇÃO
// =========================
const API = "http://localhost:3000";

// =========================
// 🔑 LOGIN
// =========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value;
        const senha = document.getElementById("senha").value;

        const res = await fetch(API + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, senha })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem("token", data.token);
            window.location = "dashboard.html";
        } else {
            alert("Login inválido!");
        }
    });
}

// =========================
// 🔒 VERIFICA LOGIN
// =========================
function verificarLogin() {
    const token = localStorage.getItem("token");
    if (!token) window.location = "index.html";
}

// =========================
// 🏠 DASHBOARD / CRUD
// =========================
if (document.getElementById("tabelaUsuarios")) {
    verificarLogin();
    carregar();

    document.getElementById("formCadastro").addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("id").value;
        const nome = document.getElementById("nome").value;

        await fetch(API + "/salvar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + localStorage.getItem("token")
            },
            body: JSON.stringify({ id, nome })
        });

        carregar();
    });
}

// =========================
// 📥 CARREGAR USUÁRIOS
// =========================
async function carregar() {
    const res = await fetch(API + "/listar", {
        headers: {
            "Authorization": "Token " + localStorage.getItem("token")
        }
    });

    const dados = await res.json();
    const tabelaUsuarios = document.getElementById("tabelaUsuarios");
    tabelaUsuarios.innerHTML = "";

    dados.forEach(u => {
        tabelaUsuarios.innerHTML += `
        <tr>
            <td>${u.id}</td>
            <td>${u.nome}</td>
            <td>
                <button onclick="editar(${u.id}, '${u.nome}')">Editar</button>
                <button onclick="deletar(${u.id})">Excluir</button>
            </td>
        </tr>`;
    });
}

// =========================
// ✏️ EDITAR
// =========================
function editar(id, nome) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
}

// =========================
// ❌ DELETAR
// =========================
async function deletar(id) {
    await fetch(API + "/deletar/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Token " + localStorage.getItem("token")
        }
    });
    carregar();
}

// =========================
// 🚪 LOGOUT
// =========================
function logout() {
    localStorage.removeItem("token");
    window.location = "index.html";
}
