// Lógica do Modal
const profileImage = document.getElementById("profileImage");
const userModal = document.getElementById("userModal");
const closeModal = document.getElementById("closeModal");
const userForm = document.getElementById("userForm");

// Carregar dados do localStorage ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
  if (savedProfile) {
    profileImage.src = savedProfile.photo || "./image/usuario.png";
    document.getElementById("userName").value = savedProfile.name || "";
    document.getElementById("userEmail").value = savedProfile.email || "";
    document.getElementById("userAddress").value = savedProfile.address || "";
    document.getElementById("userPhone").value = savedProfile.phone || "";
  }

  const savedFormData = JSON.parse(localStorage.getItem("formData"));
  if (savedFormData) {
    Object.keys(savedFormData).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === "radio" || element.type === "checkbox") {
          if (element.value === savedFormData[key]) {
            element.checked = true;
          }
        } else {
          element.value = savedFormData[key];
        }
      }
    });
  }
});

profileImage.addEventListener("click", () => {
  userModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  userModal.classList.add("hidden");
});

userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userName = document.getElementById("userName").value;
  const userEmail = document.getElementById("userEmail").value;
  const userAddress = document.getElementById("userAddress").value;
  const userPhone = document.getElementById("userPhone").value;
  const userPhoto = document.getElementById("userPhoto").files[0];

  if (userPhoto) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.src = e.target.result;
      localStorage.setItem("userProfile", JSON.stringify({
        name: userName,
        email: userEmail,
        address: userAddress,
        phone: userPhone,
        photo: e.target.result,
      }));
    };
    reader.readAsDataURL(userPhoto);
  } else {
    localStorage.setItem("userProfile", JSON.stringify({
      name: userName,
      email: userEmail,
      address: userAddress,
      phone: userPhone,
      photo: profileImage.src,
    }));
  }

  userModal.classList.add("hidden");
});

// Salvar dados do formulário no localStorage ao alterar
document.querySelectorAll("input, select, textarea").forEach(element => {
  element.addEventListener("change", () => {
    const formData = {};
    document.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.type === "radio" || el.type === "checkbox") {
        if (el.checked) formData[el.name] = el.value;
      } else {
        formData[el.id] = el.value;
      }
    });
    localStorage.setItem("formData", JSON.stringify(formData));
  });
});

// Função para validar todos os campos
function validarCampos() {
  const camposObrigatorios = [
    document.getElementById("data").value,
    document.getElementById("hora").value,
    document.getElementById("vistoriador").value,
    document.getElementById("funcao").value,
    document.getElementById("nivel_tanque1").value,
    document.getElementById("nivel_tanque2").value,
    document.getElementById("corrente_fase").value,
    document.getElementById("tensao_fase_neutro").value,
    document.getElementById("tensao_fase_fase").value,
    document.getElementById("potencia_kw").value,
    document.getElementById("disjuntor_geral").value,
    document.getElementById("sinal_alerta").value,
    document.getElementById("nivel_combustivel_motor").value,
    document.getElementById("bateria_volts").value,
    document.getElementById("tempo_operacao").value,
    document.getElementById("numero_partidas").value,
    document.getElementById("troca_oleo_filtro").value,
    document.querySelector('input[name="nivel_oleo"]:checked')?.value,
    document.getElementById("matos").value,
    document.getElementById("sujidade").value,
    document.getElementById("objetos").value,
    document.getElementById("escada").value,
  ];

  return camposObrigatorios.every(campo => campo !== "" && campo !== null && campo !== undefined);
}

// Lógica do PDF
document.getElementById("btnEnviar").addEventListener("click", () => {
  if (!validarCampos()) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      text: 'Por favor, preencha todos os campos antes de gerar o PDF.',
    });
    return;
  }

  Swal.fire({
    title: 'Gerar PDF?',
    text: 'Deseja gerar o PDF do checklist?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, gerar PDF!',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      const element = document.querySelector("main");

      html2canvas(element, {
        scale: 3, // Aumenta a escala para melhorar a qualidade
        useCORS: true, // Permite carregar imagens externas (se houver)
        logging: true, // Habilita logs para depuração
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // Largura do A4 em mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Adicionar título ao PDF
        pdf.setFontSize(18);
        pdf.text("Relatório Diário do Gerador", 105, 15, { align: "center" });


        // Ajusta a altura da imagem para caber em uma única página
        const pageHeight = 297; // Altura do A4 em mm
        if (imgHeight > pageHeight) {
          const ratio = pageHeight / imgHeight;
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, pageHeight);
        } else {
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }
        pdf.setFontSize(14);
        pdf.save("checklist.pdf");
      });
    }
  });
});

// Lógica de validação e fechamento
document.getElementById("btnFechar").addEventListener("click", () => {
  Swal.fire({
    title: 'Fechar formulário?',
    text: 'Todos os dados serão perdidos. Deseja continuar?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, fechar!',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      document.querySelectorAll("input").forEach(input => input.value = "");
      document.querySelectorAll("select").forEach(select => select.selectedIndex = 0);
      window.location.href = "index.html";
    }
  });
});