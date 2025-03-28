const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const { config } = require('../config/config');
const UserService = require('./user.service');

const service = new UserService();

class AuthService {

  async getUser(email, password) {
    const user = await service.findByEmail(email)
    if (!user) {
      throw boom.unauthorized()
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw boom.unauthorized()
    }
    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  signToken(user) {
    const secret = config.jwtSecret;
    const payload = {
      sub: user.id,
      role: user.role,
    }
    const token = jwt.sign(payload, secret);
    return {
      user,
      token,
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email)
    if (!user) {
      throw boom.unauthorized()
    }
    const payload = {
      sub: user.id,
    }
    const token = jwt.sign(
      payload,
      config.jwtSecret, // opcional utilizar otro secret para recuperacion de password
      {expiresIn: '15min'}
    );
    const link = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, {recoveryToken: token});
    const mail = {
      from: '👻 ' + config.gmailUser,
      to: user.email,
      subject: "Email para recuperar contraseña",
      html: `<b>Ingresa a este link => ${link} </b>`,
    }
    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub)
      console.log(payload, user)
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, {recoveryToken: null, password: hash});
      console.log('murio antes de llegar')
      return { message: 'password change' }
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: config.gmailUser,
        pass: config.gmailPassword
      }
    });

    await transporter.sendMail(infoMail);
    return { message: 'mail sent' }
  }
}

module.exports = AuthService;