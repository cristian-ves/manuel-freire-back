require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/submit", (req, res) => {
  const { nombre, correo, telefono, descripcion, llamadaCheckbox } = req.body;

  const nodemailer = require("nodemailer");

  const emailRoot = process.env.EMAIL_USER;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: emailRoot,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const proposalHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" rel="stylesheet">
      <style>
        .container {
          font-family: "Lato", sans-serif;
        }

        .header {
          color: #eee;
          background: #0f7490;
          margin: 0;
          padding: 0.8rem;
        }

        .data-container {
          background: #f1fdfb;
          padding-left: 1rem;
        }

        .data {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .data li {
          margin-bottom: 0.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Propuesta de proyecto</div>
        <div class="data-container">
          <h1>¡Un cliente ha ingresado una nueva propuesta!</h1>
          <table class="data">
            <tr>
              <td>Nombre:</td>
              <td>${nombre}</td>
            </tr>
            <tr>
              <td>Correo electrónico:</td>
              <td>${correo}</td>
            </tr>
            ${
              llamadaCheckbox === "true"
                ? `<tr><td>Teléfono:</td><td>${telefono}</td></tr>`
                : ""
            }
            <tr>
              <td>Descripción:</td>
              <td>${descripcion}</td>
            </tr>
          </table>
          <p>El cliente ha aceptado las políticas de privacidad</p>
          ${
            llamadaCheckbox === "true"
              ? "<p>El cliente ha aceptado recibir una llamada telefónica en horas hábiles</p>"
              : "<p>El cliente <strong>NO</strong> ha aceptado recibir una llamada telefónica en horas hábiles</p>"
          }
          <a href="manupintores.es">Ir a la página web</a>
          <!-- TODO: poner dominio de página web -->
        </div>
      </div>
    </body>
  </html>

  `;

  const proposalMailOptions = {
    from: emailRoot,
    to: "manuelfm_1965@hotmail.com",
    subject: "Nueva propuesta",
    html: proposalHTML,
  };

  const proposalMailOptionsBackUp = {
    from: emailRoot,
    to: emailRoot,
    subject: "Nueva propuesta",
    html: proposalHTML,
  };

  const clientMailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: "Presupuesto para tu propuesta",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" rel="stylesheet">
        <style>
          .container {
            font-family: "Lato", sans-serif;
          }

          .header {
            color: #eee;
            background: #0f7490;
            margin: 0;
            padding: 0.8rem;
          }

          .data-container {
            background: #f1fdfb;
            padding-left: 1rem;
          }

          .data {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .data li {
            margin-bottom: 0.5rem;
          }
        </style>
      </head>
      <body>
        <div ="container">
          <div class="header">Presupuesto para tu propuesta</div>
          <div class="data-container">
            <h1>Propuesta de proyecto</h1>
            <p>Hola! muchas gracias por habernos mandado tu propuesta, la leerémos lo más pronto posible y te enviaremos el presupuesto</p>
            <p>Detalles de la propuesta planteada:</p>
            <table class="data">
              <tr>
                <td>Nombre:</td>
                <td>${nombre}</td>
              </tr>
              <tr>
                <td>Correo electrónico:</td>
                <td>${correo}</td>
              </tr>
              ${
                telefono && llamadaCheckbox === "true"
                  ? `<tr><td>Teléfono:</td><td>${telefono}</td></tr>`
                  : ""
              }
              <tr>
                <td>Descripción:</td>
                <td>${descripcion}</td>
              </tr>
            </table>
            ${
              telefono && llamadaCheckbox === "true"
                ? "<p>Ya que has aceptado recibir una llamada en horas hábiles lo haremos en cuanto se pueda</p>"
                : ""
            }
            <a href="manupintores.es">Ir a la página web</a>
            <!-- TODO: poner dominio de página web -->
          </div>
        </div>
      </body>
    </html>
    `,
  };

  transporter.sendMail(proposalMailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email", " ", error);
    } else {
      res.send("Thank you for submitting the form!");
    }
  });

  transporter.sendMail(proposalMailOptionsBackUp, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email", " ", error);
    } else {
      res.send("Thank you for submitting the form!");
    }
  });

  transporter.sendMail(clientMailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email", " ", error);
    } else {
      console.log("Email sent: " + info.response);
      res.send("Thank you for submitting the form!");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
