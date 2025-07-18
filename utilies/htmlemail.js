function generateHtmlEmail (name)  {

return `<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cuenta creada</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      display: flex;
      height: 100vh;
      align-items: center;
      justify-content: center;
    }
    .success-message {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 40px 60px;
      text-align: center;
      max-width: 480px;
    }
    .success-message h1 {
      color: #2d8fdd;
      margin-bottom: 20px;
    }
    .success-message p {
      color: #333;
      font-size: 18px;
      margin-bottom: 30px;
    }
    .success-message .btn {
      display: inline-block;
      padding: 12px 30px;
      font-size: 16px;
      color: #fff;
      background-color: #2d8fdd;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
    }
    .success-message .btn:hover {
      background-color: #236fb8;
    }
  </style>
</head>
<body>

  <div class="success-message">
    <h1>🎉 ¡Bienvenido a Mooday!</h1>
    <p>Tu cuenta se ha creado con éxito ${name}. Ya puedes empezar a explorar y encontrar tu próxima lectura favorita.</p>
   
  </div>

</body>
</html>`;
    
}


module.exports = generateHtmlEmail;