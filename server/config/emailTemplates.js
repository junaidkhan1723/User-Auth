export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification - User Auth</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      background: #f8fafc;
      font-family: 'Segoe UI', sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 500px;
      margin: 40px auto;
      padding: 20px 30px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      width: 60px;
    }
    h1 {
      font-size: 20px;
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
    }
    .otp {
      background: #2563eb;
      color: #fff;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      padding: 10px;
      margin: 20px 0;
      border-radius: 6px;
      letter-spacing: 2px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #64748b;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://ik.imagekit.io/junaid1723/blogs/U_A%20logo.png?updatedAt=1752819397459" alt="User Auth Logo" />
    </div>
    <h1>Email Verification</h1>
    <p>Hello {{username}},</p>
    <p>Please use the OTP below to verify your email address:</p>
    <div class="otp">{{otp}}</div>
    <p>Your email: <strong>{{email}}</strong></p>
    <p>This OTP will expire in 15 minutes.</p>
    <div class="footer">
      &copy; 2025 User Auth · Developed by Junaid Khan
    </div>
  </div>
</body>
</html>
`;


export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Reset - User Auth</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      background: #f9fafb;
      font-family: 'Segoe UI', sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 500px;
      margin: 40px auto;
      padding: 20px 30px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      width: 60px;
    }
    h1 {
      font-size: 20px;
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
    }
    .otp {
      background: #2563eb;
      color: #fff;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      padding: 10px;
      margin: 20px 0;
      border-radius: 6px;
      letter-spacing: 2px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #64748b;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://ik.imagekit.io/junaid1723/blogs/U_A%20logo.png?updatedAt=1752819397459" alt="User Auth Logo" />
    </div>
    <h1>Reset Your Password</h1>
    <p>Hello {{username}},</p>
    <p>Use the OTP below to reset your password:</p>
    <div class="otp">{{otp}}</div>
    <p>Your email: <strong>{{email}}</strong></p>
    <p>This OTP is valid for 15 minutes.</p>
    <div class="footer">
      &copy; 2025 User Auth · Developed by Junaid Khan
    </div>
  </div>
</body>
</html>
`;


export const WELCOME_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome - User Auth</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      background: #f9fafb;
      font-family: 'Segoe UI', sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 500px;
      margin: 40px auto;
      padding: 20px 30px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      width: 60px;
    }
    h1 {
      font-size: 22px;
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background: #2563eb;
      color: white;
      border-radius: 6px;
      text-decoration: none;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #64748b;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://ik.imagekit.io/junaid1723/blogs/U_A%20logo.png?updatedAt=1752819397459" alt="User Auth Logo" />
    </div>
    <h1>Welcome to User Auth</h1>
    <p>Hi {{username}},</p>
    <p>Your account has been successfully created.</p>
    <p>Email: <strong>{{email}}</strong></p>
    <a class="btn" href="https://your-auth-app.vercel.app">Go to Dashboard</a>
    <div class="footer">
      &copy; 2025 User Auth · Built by Junaid Khan
    </div>
  </div>
</body>
</html>
`;
