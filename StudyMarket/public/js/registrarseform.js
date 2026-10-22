const formulario = document.querySelector('#formularioRegistro')

const nombreInput = document.querySelector("#lbl-nombre")
const apellidoInput = document.querySelector("#lbl-apellido")
const emailInput = document.querySelector("#lbl-email")

const nombreError = document.querySelector('[data-error="nombre-error"]');
const apellidoError = document.querySelector('[data-error="apellido-error"]');
const emailError = document.querySelector('[data-error="email-error"]');

const validarNombre = () => {
  if (nombreInput.value.trim() === '') {
    nombreError.textContent = "El nombre es obligatorio";
  } else {
    nombreError.textContent = '';
  }
};

const validarApelldo = () => {
  if (apellidoInput.value.trim() === '') {
    apellidoError.textContent = "El apellido es obligatorio";
  } else {
    apellidoError.textContent = '';
  }
};
const validarEmail = () => {
  if (emailInput.value.trim() === '') {
    emailError.textContent = "El correo es obligatorio";
  } else {
    emailError.textContent = '';
  }
};

const resetearFormulario = () => {
    nombreInput.value = ""
    apellidoInput.value = ""
    apellidoInput.value = ""
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault()

    validarNombre()
    validarApelldo()

    let isNombreValid = nombreError.textContent === ''
    let isApellidoValid = apellidoError.textContent === ''

    if (isNombreValid && isApellidoValid) {
        const formData = {
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim()
        }
        console.log('Formulario valido:', formData);
        
    } else {
        console.log('No se envio el formulario');
        
    }
})
