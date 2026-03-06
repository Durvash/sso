const userModel = require('./user.model');
const { generateToken } = require('../../helpers/general');
const rabbitClient = require('../../utils/rabbit.util');
const redisClient = require('../../config/redis');

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

    // Get user data with company detail, so update the session to accesss user invitation module
    const [user, userError] = await userModel.getUserById(req.user?.id);
    if (userError) {
      throw new Error(userError);
    }

    // Update the session data
    const redisKey = `session:${req.user?.id}`;
    const loginDataRaw = await redisClient.get(redisKey);
    const loginData = loginDataRaw ? JSON.parse(loginDataRaw) : {};
    const userData = {
      ...loginData,
      user_role: user[0]?.user_role,
      company_id: user[0]?.company_id
    }
    await redisClient.set(redisKey, JSON.stringify(userData), {
      EX: 24 * 60 * 60, // 24 hours in seconds
    });
    
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
        message: 'You have no access to invite users.',
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
      rabbitClient.publishNotification('notification.sso.invite', {
        type: 'USER_INVITATION',
        recipient: email,
        content: { token: token, url: `http://localhost:${process.env.PORT}/api/v1/user/join/${email}/${token}` }
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
