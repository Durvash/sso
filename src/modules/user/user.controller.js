const userModel = require('./user.model');
const { generateToken } = require('../../helpers/general');
const rabbitClient = require('../../utils/rabbit.util');

const userController = {
  addcompany,
  inviteUsers
};

async function addcompany(req, res) {
  try {
    const { company_name } = req.body;

    // Add company data
    const [newCompany, newCompanyError] = await userModel.addcompany(company_name, req.user?.id);
    if (newCompanyError) {
      throw new Error(newCompanyError);
    }

    res.status(200).json({
      success: true,
      message: 'Company has been added successfully.',
      data: newCompany,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to adding a company, please try again!',
      stack: e.message,
    });
  }
}

async function inviteUsers(req, res) {
  try {
    const { emails } = req.body;
    const { company_id, user_role } = req.user;
    
    if (user_role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied!',
      });
    }

    let emailArr = null;
    if (typeof emails === 'string') {
      emailArr = emails.split(',');
    }
    
    if (!Array.isArray(emailArr) || emailArr.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Email(s) are required!',
      });
    }

    // Check email(s) are already exist or not
    const [existEmails, existEmailsError] = await userModel.checkEmailsExist(emailArr);
    if (existEmailsError) {
      throw new Error(existEmailsError);
    }

    if (existEmails.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Email(s) are already exists in our system!',
        emails: existEmails,
      });
    }

    // Insert users invitation in table to send email via third party (BullMQ / RabbitMQ)
    const token = await generateToken();
    const [invitation, invitationError] = await userModel.addInvitation({company_id: company_id, emails: emailArr, token: token});
    if (invitationError) {
      throw new Error(invitationError);
    }
    
    // Send email to users for inviting
    for (const email of emailArr) {
      console.log('============== DEBUG START 🚀 ==============');
      console.log('File: user.controller.js | Line: 81');
      console.log(email);
      console.log(rabbitClient);
      console.log('============== DEBUG END ==============');
      rabbitClient.publishNotification('notification.sso.invite', {
        type: 'USER_INVITATION',
        recipient: email,
        content: { token: token, url: `http://localhost:${process.env.PORT}/join/${email}/${token}` }
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Invitation sent successfullly.',
      data: invitation
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Failed to inviting user, please try again!',
      stack: e.message,
    });
  }
}

module.exports = userController;
