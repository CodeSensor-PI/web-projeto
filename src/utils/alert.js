import Swal from "sweetalert2";
import "../App.css";
import Cleave from "cleave.js";
import axios from "axios";

export function errorMessage(mensagem, size = "small") {
  Swal.fire({
    position: "top-end",
    icon: "error",
    title: mensagem,
    showConfirmButton: false,
    timer: 2300,
    backdrop: false,
    customClass: {
      popup: `swal-${size}`,
    },
  });
}

export function responseMessage(mensagem, size = "small") {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: mensagem,
    showConfirmButton: false,
    timer: 2300,
    backdrop: false,
    customClass: {
      popup: `swal-${size}`,
    },
  });
}

export async function popupMessage(planoId) {
  try {
    const { data } = await axios.get(`/planos`);

    // Encontrar os valores de semanal e mensal no array retornado
    const semanal =
      data.find((plano) => plano.categoria === "Semanal")?.preco || 0;
    const mensal =
      data.find((plano) => plano.categoria === "Mensal")?.preco || 0;

    Swal.fire({
      title: '<span style="color: #1B66A4;">Editar Valores do Plano</span>',
      html: `
        <label for="semana" style="display: block; text-align: left; margin-top: 10px; color: #000000;">Semanal:</label>
        <input id="semana" class="swal2-input input-app" placeholder="R$ 0,00" value="${semanal}">
        <label for="mensal" style="display: block; text-align: left; margin-top: 10px; color: #000000;">Mensal:</label>
        <input id="mensal" class="swal2-input input-app" placeholder="R$ 0,00" value="${mensal}">
      `,
      background: "#FFFFFF", // TrueWhiteFy
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Salvar",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#F5F5F5", // WhiteFy
      customClass: {
        popup: "swal-medium",
        confirmButton: "btn_primario",
        cancelButton: "btn_secundario",
      },
      didOpen: () => {
        new Cleave("#semana", {
          numeral: true,
          numeralThousandsGroupStyle: "thousand",
          prefix: "R$ ",
          noImmediatePrefix: false,
          rawValueTrimPrefix: true,
          numeralDecimalMark: ",",
          delimiter: ".",
        });

        new Cleave("#mensal", {
          numeral: true,
          numeralThousandsGroupStyle: "thousand",
          prefix: "R$ ",
          noImmediatePrefix: false,
          rawValueTrimPrefix: true,
          numeralDecimalMark: ",",
          delimiter: ".",
        });
      },
      preConfirm: () => {
        const semana = document
          .getElementById("semana")
          .value.replace("R$ ", "")
          .replace(".", "")
          .replace(",", ".");
        const mensal = document
          .getElementById("mensal")
          .value.replace("R$ ", "")
          .replace(".", "")
          .replace(",", ".");

        if (
          !semana ||
          !mensal ||
          parseFloat(semana) <= 0 ||
          parseFloat(mensal) <= 0
        ) {
          Swal.showValidationMessage(
            "Os valores devem ser maiores que zero e não podem estar vazios."
          );
          return false;
        }

        return { semanal: parseFloat(semana), mensal: parseFloat(mensal) };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const planosAtualizados = data.map((plano) => {
            if (plano.categoria === "Semanal") {
              return { ...plano, preco: result.value.semanal };
            }
            if (plano.categoria === "Mensal") {
              return { ...plano, preco: result.value.mensal };
            }
            return plano;
          });

          await Promise.all(
            planosAtualizados.map((plano) =>
              axios.put(`/planos/${plano.id}`, {
                preco: plano.preco,
                categoria: plano.categoria,
              })
            )
          );

          Swal.fire(
            "Sucesso!",
            "Os valores foram atualizados com sucesso.",
            "success"
          );
        } catch (error) {
          Swal.fire("Erro!", "Não foi possível atualizar os valores.", "error");
          console.error(error);
        }
      }
    });
  } catch (error) {
    Swal.fire(
      "Erro!",
      "Não foi possível carregar os valores do plano.",
      "error"
    );
    console.error(error);
  }
}

export function confirmCancelEdit(titulo, message, size) {
  return Swal.fire({
    title: titulo,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, cancelar",
    cancelButtonText: "Continuar editando",
    cancelButtonColor: "#1B66A4",
    confirmButtonColor: "#d33",
    customClass: {
      popup: "swal-small",
      // confirmButton: "",
      // cancelButton: "",
    },
    backdrop: false,
  });
}
