// Sistema de tema claro/escuro simples usando localStorage

let tema = localStorage.getItem("tema"); 
const botaoTema = document.getElementById("btn-tema");

// Ativar modo escuro
function ativarEscuro() {
    document.body.classList.add("escuro");
    localStorage.setItem("tema", "escuro");
}

// Ativar modo claro
function ativarClaro() {
    document.body.classList.remove("escuro");
    localStorage.setItem("tema", "claro");
}

// Carregar tema salvo
if (tema === "escuro") {
    ativarEscuro();
}

// Ao clicar no botão
botaoTema.addEventListener("click", () => {
    tema = localStorage.getItem("tema");
    tema !== "escuro" ? ativarEscuro() : ativarClaro();
});