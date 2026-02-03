const userModel = require('./user.model');

const userController = {
  addcompany,
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

module.exports = userController;
